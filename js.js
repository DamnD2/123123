const signupForm = signupFormWrapper.querySelector('.signup');
const users = new LocalStorageAdapter('users', 'array');

signupFormConfig = [
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

signupForm.addEventListener('submit',() => handleSignupSubmit(signupFormConfig, signupForm));

function handleSignupSubmit(formConfig, form) {
  let successfully = true;

  formConfig.forEach(({ name, validators }) => {
    const field = form.querySelector(`.${name}`);
    const errorField = form.querySelector(`.${name}-error`);
    const fieldValue = field.value;
    const errors = validators.reduce((accum, currentValidator) => {
      const { errorMessage, validator } = currentValidator;
      accum += validator(fieldValue) ? '' : errorMessage;

      return accum;
    }, '');

    errorField.innerText = errors;

    if (errors) {
      field.classList.add('error');
      successfully = false;
    } else {
      field.classList.remove('error');
    }
  });

  if (successfully) {
    const newUser = formConfig.reduce((accum, { name }) => {
      const field = form.querySelector(`.${name}`);
      accum[name] = field.value;
      return accum;
    }, {});
    const fields = formConfig.reduce((accum, { name }) => {
      const field = form.querySelector(`.${name}`);
      accum.push(field);
      return accum;
    }, [])

    users.setValue(newUser);
    clearFields(...fields);
  }
}