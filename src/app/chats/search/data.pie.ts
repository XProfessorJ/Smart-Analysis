export var single = [
  {
    name: "Germany",
    value: 8940000,
  },
  {
    name: "USA",
    value: 5000000,
  },
  {
    name: "France",
    value: 7200000,
  },
];

export class PieChartDataModel {
  data: any[] = [];
  constructor(data) {
    data.userStoryStatus.map((us: any) => {
      this.data.push({
        name: us.userStoryId,
        pie: [
          {
            name: "Excute Rate",
            value: Number.parseFloat(us.executeRate.replace("%")),
          },
          {
            name: "Pass Rate",
            value: Number.parseFloat(us.passRate.replace("%")),
          },
        ],
      });
    });
  }
}
