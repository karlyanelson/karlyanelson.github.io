---
layout: post.njk
tags: post
title: How to add your own custom color palette to Chart JS
publishedDate: September 18, 2024
updatedDate: September 18, 2024
inProgress: true
techStack:
  - Typescript v5
  - Chart JS (react-chartjs-2 v5.2)
  - React v19
---

## Make your own custom Colors plugin

Based this off of how ChartJS does their [Colors](https://www.chartjs.org/docs/latest/general/colors.html) plugin

```ts
// chart-colors.ts

import type { Chart, ChartDataset } from "chart.js";
import { DoughnutController, PolarAreaController } from "chart.js";

const BORDER_COLORS = [
  "rgb(54, 162, 235)",
  "rgb(255, 99, 132)",
  "rgb(255, 159, 64)",
  "rgb(255, 205, 86)",
  "rgb(75, 192, 192)",
  "rgb(153, 102, 255)",
  "rgb(201, 203, 207)", // grey
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

## Use it in your chart

Using [react-chartjs-2](https://react-chartjs-2.js.org/)

```tsx
// your chart component file
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

import { customChartColors } from "./chart-colors";

import { data } from "./data";

export default function App() {
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

### Note: This makes the chart responsive:

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

I made a CodeSandbox -
[chart-js-custom-colors - CodeSandbox](https://codesandbox.io/s/chart-js-custom-colors-zyn2p6)
