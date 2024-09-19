---
layout: post.njk
tags: post
title: How to add your own custom color palette to Chart JS
date: Last Modified
description: Be able to have a longer list of available colors that ChartJS can automatically loop through.

techStack:
  - name: Typescript
    version: 5.1
    url: https://www.typescriptlang.org/
  - name: Chart JS
    version: 4.4
    url: https://www.chartjs.org/docs/4.4.4/
  - name: react-chartjs-2
    version: 5.2
    url: https://github.com/reactchartjs/react-chartjs-2
  - name: React
    version: 18.3
    url: https://react.dev/
---

## The Problem

I have a charts that can have many lines or bars, and, as of this writing, [ChartJS only has 7 colors out of the box](https://www.chartjs.org/docs/4.4.4/general/colors.html). You can put custom colors per dataset, but my datasets are dynamic. I just wanted to be able to have a longer list of available colors that ChartJS could automatically loop through.

## Solution Summary

I copied ChartJS's Colors plugin ([docs](https://www.chartjs.org/docs/latest/general/colors.html), [source code](https://github.com/chartjs/Chart.js/blob/master/src/plugins/plugin.colors.ts)) and modified it to have a longer list of colors.

## The Explanation

### Make your own custom Colors plugin

I based this off of how ChartJS does their Colors plugin ([docs](https://www.chartjs.org/docs/latest/general/colors.html), [source code](https://github.com/chartjs/Chart.js/blob/master/src/plugins/plugin.colors.ts)). The following examples are in Typescript, but could also work in Javascript if you take out all the type stuff.

The 75% transparency is optional. If you just want your colors at 100% all the time, you can use hex values like `#FFFFFF` instead of `rgb(255, 255, 255)` and get rid of the `BACKGROUND_COLORS` logic.

```ts
//// chart-colors.ts

import type { Chart, ChartDataset } from "chart.js";
import { DoughnutController, PolarAreaController } from "chart.js";

// list of your custom colors
const BORDER_COLORS = [
  "rgb(54, 162, 235)",
  "rgb(255, 99, 132)",
  "rgb(255, 159, 64)",
  "rgb(255, 205, 86)",
  "rgb(75, 192, 192)",
  "rgb(153, 102, 255)",
  "rgb(201, 203, 207)",
  "rgb(161, 77, 160)",
  "rgb(1, 240, 139)",
  "rgb(255, 44, 44)",
  "rgb(65, 232, 255)",
  "rgb(49, 85, 255)",
  "rgb(212, 88, 255)",
  "rgb(141, 228, 0)",
  "rgb(93, 53, 255)",
  "rgb(4, 133, 117)",
  "rgb(4, 188, 67)",
  "rgb(228, 0, 150)",
  "rgb(106, 191, 203)",
  "rgb(255, 136, 222)",
  "rgb(228, 96, 0)",
];

// Border colors with 75% transparency
const BACKGROUND_COLORS = /* #__PURE__ */ BORDER_COLORS.map((color) =>
  color.replace("rgb(", "rgba(").replace(")", ", 0.75)")
);
function getBorderColor(i: number) {
  return BORDER_COLORS[i % BORDER_COLORS.length];
}
function getBackgroundColor(i: number) {
  return BACKGROUND_COLORS[i % BACKGROUND_COLORS.length];
}
function colorizeDefaultDataset(dataset: ChartDataset, i: number) {
  dataset.borderColor = getBorderColor(i);
  dataset.backgroundColor = getBackgroundColor(i);
  return ++i;
}
function colorizeDoughnutDataset(dataset: ChartDataset, i: number) {
  dataset.backgroundColor = dataset.data.map(() => getBorderColor(i++));
  return i;
}
function colorizePolarAreaDataset(dataset: ChartDataset, i: number) {
  dataset.backgroundColor = dataset.data.map(() => getBackgroundColor(i++));
  return i;
}

function getColorizer(chart: Chart) {
  let i = 0;
  return (dataset: ChartDataset, datasetIndex: number) => {
    const controller = chart.getDatasetMeta(datasetIndex).controller;
    if (controller instanceof DoughnutController) {
      i = colorizeDoughnutDataset(dataset, i);
    } else if (controller instanceof PolarAreaController) {
      i = colorizePolarAreaDataset(dataset, i);
    } else if (controller) {
      i = colorizeDefaultDataset(dataset, i);
    }
  };
}

export const customChartColors = {
  id: "customChartColors",
  defaults: {
    enabled: true,
  },
  beforeLayout(chart: Chart, _args: any, options: any) {
    if (!options.enabled) {
      return;
    }
    const {
      data: { datasets },
    } = chart.config;
    const colorizer = getColorizer(chart);
    datasets.forEach(colorizer);
  },
};
```

### Use it in your chart

Using [react-chartjs-2](https://react-chartjs-2.js.org/)

```tsx
//// your chart component file - MyCoolChart.tsx
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  BarElement,
  Filler,
  ArcElement,
} from "chart.js";
import { Line } from "react-chartjs-2";

// The custom color plugin we made
import { customChartColors } from "./chart-colors";

// Your data you feed to the chart
import { data } from "./data";

export default function MyCoolChart() {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    TimeScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    BarElement,
    ArcElement,
    customChartColors
  );

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      customChartColors: {
        enabled: true,
      },
    },
  };

  const style = { minHeight: 300 };

  return (
    <div className="relative max-w-full" style={style}>
      <Line options={options} data={data} />
    </div>
  );
}
```

## Bonus Points: How to make the chart responsive

```tsx
const options = {
  responsive: true,
  maintainAspectRatio: false,
};

const style = { minHeight: 300 };

return (
  <div className="relative max-w-full" style={style}>
    <Line options={options} data={data} />
  </div>
);
```

## Example of it in action

I made a CodeSandbox - [chart-js-custom-colors - CodeSandbox](https://codesandbox.io/s/chart-js-custom-colors-zyn2p6)
