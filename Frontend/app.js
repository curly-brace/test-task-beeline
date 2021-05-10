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
            this.userValidate = {
                name: !!this.userLogin.name.trim(),
                pass: !!this.userLogin.name.trim(),
                result: false
            };
            if (this.userValidate.result) alert("ok");
            alert("not ok");
        }
    }
}

const RegistrationForm = {
    template:
    // тут css-классы те-же, но это не так важно по-моему, потому-что зачем плодить сущности
    `<div class="login-form">
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
            this.userValidate = {
                name: !!this.userRegister.name.trim(),
                pass: !!this.userRegister.name.trim(),
                result: false
            };
            if (this.userValidate.result) alert("ok");
            alert("not ok");
        }
    }
}

const UserPage = {
    template: 
      `<div>
      <h1>user</h1>
       </div>`
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
    })
})