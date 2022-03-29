import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../../../@stbui/core";
import { ApiService } from "src/api.service";

@Component({
  selector: "stbui-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  userForm: FormGroup;
  formErrors = {
    email: "",
    password: "",
    loginFailure: "",
  };
  validationMessages = {
    email: {
      required: "Please enter your user name",
      email: "Wrong username / password",
    },
    password: {
      required: "Please enter your password",
      pattern: "Wrong username / password",
      minlength: "Wrong username / password",
      maxlength: "Wrong username / password",
    },
  };

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private auth: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.userForm = this.fb.group({
      email: [
        "jimmy",
        [
          Validators.required,
          // Validators.email
        ],
      ],
      password: [
        "mbol1234",
        [
          Validators.pattern("^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$"),
          Validators.minLength(6),
          Validators.maxLength(25),
        ],
      ],
    });

    this.userForm.valueChanges.subscribe((data) => this.onValueChanged(data));
    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.userForm) {
      return;
    }
    const form = this.userForm;
    for (const field in this.formErrors) {
      if (
        Object.prototype.hasOwnProperty.call(this.formErrors, field) &&
        (field === "email" || field === "password")
      ) {
        this.formErrors[field] = "";
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (Object.prototype.hasOwnProperty.call(control.errors, key)) {
              this.formErrors[field] += `${
                (messages as { [key: string]: string })[key]
              } `;
            }
          }
        }
      }
    }
  }

  async signInWithGoogle() {
    await this.auth.googleLogin();
    return await this.afterSignIn();
  }

  async signInWithGithub() {
    await this.auth.githubLogin();
    return await this.afterSignIn();
  }

  async signInWithFacebook() {
    await this.auth.facebookLogin();
    await this.afterSignIn();
  }

  async signInWithTwitter() {
    await this.auth.twitterLogin();
    return await this.afterSignIn();
  }

  async signInAnonymously() {
    await this.auth.anonymousLogin();
    return await this.afterSignIn();
  }

  signInWithEmail() {
    const message = {
      "auth/user-not-found": "该用户没有注册！",
      "auth/invalid-email": "请输入正确的邮箱",
    };

    const email = this.userForm.value["email"];
    const password = this.userForm.value["password"];

    this.auth
      .emailLogin(email, password)
      .then(() => this.afterSignIn())
      .catch((error) => {
        console.log("邮箱登录出错：", error);
        this.formErrors.loginFailure = message[error.code];
      });
  }

  login() {
    if (this.userForm.invalid) {
      return;
    }
    this.apiService
      .login(this.userForm.value["email"], this.userForm.value["password"])
      .subscribe((data) => {
        console.log(data);
      });
    this.afterSignIn();
  }

  private afterSignIn() {
    this.router.navigate(["/admin"]);
  }
}
