export class NavigationModel {
  public model: any[];

  constructor() {
    this.model = [
      {
        id: "apm",
        title: "Smart Analysis",
        type: "item",
        icon: "bubble_chart",
        url: "/apps/chats/search",
      },
      {
        id: "extend",
        title: "Login & Register",
        type: "collapse",
        icon: "more_horiz",
        children: [
          {
            id: "login",
            title: "Login",
            type: "item",
            url: "/login",
          },
          {
            id: "register",
            title: "Register",
            type: "item",
            url: "/register",
          },
        ],
      },
    ];
  }
}
