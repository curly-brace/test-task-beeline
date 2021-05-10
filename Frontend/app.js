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
                });
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
            if (json.is_admin == 1) this.$parent.$router.push('/admin');
          } else {
            this.$parent.$router.push('/');
          }
      });
    },
    data () {
      return { user: '' }
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
      <!-- v-model в данном случае проще чем v-on -->
      <input v-model="searchString" type="text" class="admin-search" placeholder="поиск..">
      <!-- выбор осуществляется кликом по строке -->
      <!-- сортировка осуществляется кликом по одному из заголовков -->
      <table class="table">
        <thead>
          <tr>
            <th></th>
            <th v-on:click="sort('id')">id</th>
            <th v-on:click="sort('login')">Логин</th>
            <th v-on:click="sort('is_admin')">Админ?</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredItems">
            <td><input type="checkbox" :value=" item.id " v-model="checkedIds"></td>
            <td>{{ item.id }}</td>
            <td>{{ item.login }}</td>
            <td>{{ item.is_admin ? 'yep' : 'nope' }}</td>
            <td><a v-on:click="deleteRows(item.id)" href="#">&#10006;</a></td>
          </tr>
        </tbody>
        </table>
        <a v-show="true" v-on:click="deleteRows" href="#" class="admin-del-button">Удалить выбранное</a>
        <a v-on:click="logout" href="#" class="logout-button">logout</a>
       </div>`,
       data() {
         return {
           items: [],
           searchString: '',
           checkedIds: []
         }
       },
       mounted: function() {
          this.getUsers();
          this.setupStream();
       },
       methods: {
        logout: function() {
          fetch("http://localhost/api/user_logout.php", {
              method: 'POST',
              mode: 'cors',
              credentials: 'same-origin'
          })
          this.$parent.$router.push('/');
        },
        sort: function(key) {
            this.items.sort(function(x, y) {
                if (x[key] < y[key]) return -1;
                if (x[key] > y[key]) return 1;
                return 0;
            });
        },
        deleteRows: function(id) {
          let jsonBody = '';
          if (!isNaN(parseFloat(id)) && isFinite(id)) {
            jsonBody = JSON.stringify( [id] );
          } else {
            jsonBody = JSON.stringify( this.checkedIds );
          }
          fetch("http://localhost/api/remove_users.php", {
              method: 'POST',
              mode: 'cors',
              headers: { 'Content-Type': 'application/json' },
              body: jsonBody
          })
        },
        // почему не long polling? уже устаревшая технология, к тому же много ресурсов жрет в сравнении с этим
        // почему не websockets? потому что это уже слишком жирно для такой простой задачи
        setupStream: function() {
          let es = new EventSource('http://localhost/api/feed.php');
  
          es.addEventListener('message', event => {
              console.log(event.data);
              this.getUsers();
          }, false);
        },
        getUsers: function() {
          fetch("http://localhost/api/get_users.php", {
            method: 'POST',
            mode: 'cors',
            credentials: 'same-origin'
          })
          .then(response => {
              return response.json();
          })
          // надо бы проверку замутить, ведь может как-то запрос и не выполнится.
          // но по тз ничего не было сказано)))
          .then(json => {
              if (Array.isArray(json)) {
                this.items = json;
              }
          });
        }
      },
      // впринципе есть еще вариант сделать через v-show, но я подумал так будет лучше
      // а еще лучше фильтровать на сервере, но в тз такого не было)
      computed: {
        filteredItems: function() {
          return this.items.filter(item => item.login.startsWith(this.searchString));
        }
      }
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
})