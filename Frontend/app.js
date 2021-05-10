// да, это приложение, которое не нуждается в сборке, все компоненты и код в одном файле
// я знаю что vue можно с комфортом юзать через сборщик, когда компоненты и модули раскиданы по папкам
// и я абсолютно понимаю что крупные проекты нужно делать только так
// но в данном случае я решил что для меня так будет быстрее и проще, потому что тут функционала почти нет
const FormSwitcher = {
    template: 
    `<div class="form-switcher">
      <router-link :to="\`/\`" tag="a" >Вход</router-link>
      <router-link :to="\`/register\`" tag="a">Регистрация</router-link>
    </div>`
}

const LoginForm = {
    template: 
    `<div class="login-form">
    <form-switcher></form-switcher>
      <h2>Вход</h2>
      <form class="user-form" id="login-form" v-on:submit.prevent="submitForm">
        <div class="form-input">
          <input v-model="userLogin.name" placeholder="Логин">
          <p v-show="!userValidate.name" class="form-error">Введи логин!</p>
        </div>
        <div class="form-input">
          <input v-model="userLogin.pass" placeholder="Пароль">
          <p v-show="!userValidate.pass" class="form-error">Введи пароль!</p>
        </div>
        <input type="submit" value="Войти">
        <p v-show="!userValidate.result" class="form-error">Login incorrect!</p>
      </form>
    </div>`,
    data () {
        return { userLogin: {
            name: '',
            pass: ''
        }, userValidate: {
            name: true,
            pass: true,
            result: true
        }}
    },
    methods: {
        submitForm () {
            let n = this.userLogin.name.trim();
            this.userValidate = {
                name: (n.length > 0) && (n.length < 32) && (/[A-Za-z0-9_-]/.test(n)),
                pass: !!this.userLogin.pass.trim(),
                result: true
            };
            if (this.userValidate.name && this.userValidate.pass) {
                // тут можно было подключить axios но я решил для теста сделать руками
                // заодно промис заюзал
                // отлов ошибок тут не стал делать, потому что нет времени на это
                // да и какие тут могут быть ошибки? а так тут можно и статус проверить и catch прописать
                fetch("http://localhost/api/user_login.php", {
                    method: 'POST',
                    mode: 'cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        login: this.userLogin.name,
                        password: MD5(this.userLogin.pass)
                    })
                })
                .then(response => {
                    return response.json();
                })
                .then(json => {
                    if (json.result == "success") {
                      this.userValidate.result = true;
                      this.$parent.$router.push('/user');
                    } else {
                      this.userValidate.result = false;
                    }
                });
            }
        }
    },
}

const RegistrationForm = {
    template:
    // тут css-классы те-же, но это не так важно по-моему, потому-что зачем плодить сущности
    `<div class="login-form">
    <form-switcher></form-switcher>
      <h2>Регистрация</h2>
      <form class="user-form" id="register-form" v-on:submit.prevent="submitForm">
        <div class="form-input">
          <input v-model="userRegister.name" placeholder="Логин">
          <p v-show="!userValidate.name" class="form-error">Введи логин!</p>
        </div>
        <div class="form-input">
          <input v-model="userRegister.pass" placeholder="Пароль">
          <p v-show="!userValidate.pass" class="form-error">Введи пароль!</p>
        </div>
        <input type="submit" value="Зарегистрироваться">
        <p v-show="!userValidate.result" class="form-error">Fail!</p>
      </form>
    </div>`,
    data () {
        return { userRegister: {
            name: '',
            pass: ''
        }, userValidate: {
            name: true,
            pass: true,
            result: true
        }}
    },
    methods: {
        submitForm () {
            let n = this.userRegister.name.trim();
            this.userValidate = {
                name: (n.length > 0) && (n.length < 32) && (/[A-Za-z0-9_-]/.test(n)),
                pass: !!this.userRegister.pass.trim(),
                result: true
            };
            if (this.userValidate.name && this.userValidate.pass) {
                fetch("http://localhost/api/user_register.php", {
                    method: 'POST',
                    mode: 'cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        login: this.userRegister.name,
                        password: MD5(this.userRegister.pass)
                    })
                })
                this.$parent.$router.push('/');
            }
        }
    }
}

const UserPage = {
    template: 
      `<div class="wrapper">
      <h1 class="huge">Hello, {{user}}</h1>
      <a v-on:click="logout" href="#" class="logout-button">logout</a>
       </div>`,
    mounted: function () {
      fetch("http://localhost/api/get_current_user.php", {
        method: 'POST',
        mode: 'cors',
        credentials: 'same-origin'
      })
      .then(response => {
          return response.json();
      })
      .then(json => {
          if (json.login != "none") {
            this.user = json.login;
          } else {
            console.log("no user");
            this.$parent.$router.push('/');
          }
      });
    },
    methods: {
      logout: function() {
        fetch("http://localhost/api/user_logout.php", {
            method: 'POST',
            mode: 'cors',
            credentials: 'same-origin'
        })
        this.$parent.$router.push('/');
      }
    }
}

const AdminPage = {
    template: 
      `<div>
      <h1>admin</h1>
       </div>`
}

const routes = [
    { path: '/', component: LoginForm },
    { path: '/register', component: RegistrationForm },
    { path: '/user', component: UserPage },
    { path: '/admin', component: AdminPage }
];

Vue.component('form-switcher', FormSwitcher);

const rootApp = new Vue({
    el: '#app',
    router: new VueRouter({
        routes
    }),
    data: {
      user: ''
    }
})