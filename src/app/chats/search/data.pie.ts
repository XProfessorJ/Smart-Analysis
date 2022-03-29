export class PieChartDataModel {
  data: any;
  constructor(data) {
    this.data = {
      pie: [
        {
          name: "Failed Test Cases",
          value: data.failedTestCases,
        },
        {
          name: "Passed Test Cases",
          value: data.passedTestCases,
        },
      ],
    };
  }
}
