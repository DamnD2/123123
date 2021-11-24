class Form {
  constructor(selector, validationConfig) {
    this.form = document.querySelector(selector);
    this.config = validationConfig;
    this.fields = {};
    this.init();
  }

  _init () {
    const { form, config, fields } = this;

    config.forEach(({name}) => {
      const field = form.querySelector(`.${name}`);
      const errorField = form.querySelector(`.${name}-error`);

      fields[name] = field;
      fields[`${name}-error`] = errorField;
    });
  }

  validate () {
    let successfull = true;
    const { config, fields } = this;

    config.forEach(({ name, validators }) => {
      const field = fields[name];
      const errorField = fields[`${name}-error`];
      const fieldValue = field.value;
      const errors = validators.reduce((accum, currentValidator) => {
        const { errorMessage, validator } = currentValidator;
        accum += validator(fieldValue) ? '' : errorMessage;

        return accum;
      }, '');

      errorField.innerText = errors;

      if (errors) {
        field.classList.add('error');
        successfull = false;
      } else {
        field.classList.remove('error');
      }
    });

    return successfull;
  }

  clear () {
    this.config.forEach(({ name }) => {
      const field = this.fields[name];
      field.value = '';
    });
  }
}

const signupFormConfig = [
  {
    name: 'email',
    validators: [
      {
        validator: isNotEmpty,
        errorMessage: 'Введите email. '
      },
      {
        validator: isEmail,
        errorMessage: 'Email должен содержать символ "@" и "." а так же от 2 до 4 символов после точки. '
      },
      {
        validator: isNoUserMatches,
        errorMessage: 'На данный email уже зарегистрирован аккаунт.'
      }
    ],
  },
  {
    name: 'age',
    validators: [
      {
        validator: isNotEmpty,
        errorMessage: 'Введите возраст. '
      },
      {
        validator: isNumeric,
        errorMessage: 'Допустимы только цифры.'
      }
    ],
  },
  {
    name: 'username',
    validators: [
      {
        validator: isNotEmpty,
        errorMessage: 'Введите имя пользователя. '
      },
      {
        validator: isNoUserNameMatches,
        errorMessage: 'Это имя пользователя уже занято. Попробуйте другое.'
      }
    ],
  },
  {
    name: 'password',
    validators: [
      {
        validator: isNotEmpty,
        errorMessage: 'Введите пароль. ',
      },
      {
        validator: isPassword,
        errorMessage: 'Пароль должен содержать как минимум восемь символов, заглавную букву, строчную букву, цифру и специальный символ "!$%@#£€*?&".'
      }
    ],
  },
];

const signupForm = new Form('.signup', signupFormConfig);

signupForm.form.addEventListener('submit',() => {
  const isValid = signupForm.validate();
  if (isValid) {
    console.log('OK');
    signupForm.clear();
  } else {
    console.log('NE OK');
  }
});
