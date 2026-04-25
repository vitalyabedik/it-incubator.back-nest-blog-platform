export const errorMessageVariant = {
  credentials: 'Ошибка при вводе данных пользователя',
  refreshToken: 'Некорректный refreshToken',
};

export const errorMessages = {
  noExist: 'Данного пользователя не существует',
  notFound: 'Пользователь не найден',
  alreadyDeleted: 'пользователь уже был удален',
  unauthorized: 'Пользователь не авторизован',
  uniqueLogin: 'Данный login уже существует, введите другой login',
  uniqueEmail: 'Данный email уже существует, введите другой email',
  invalidUserNameOrPassword: 'некорректный пользователь или пароль',

  uniqueUser: 'Данный пользователь уже существует',
  codeConfirmation: 'Операция с подтверждением кода не выполнена',
  updateIsConfirmedInRegistrationConfirmation:
    'Ошибка при подтверждении регистрации поля isConfirmed',
  updateIsConfirmedInEmailResending:
    'Ошибка при повторной отправке email поля isConfirmed',
  emailResending: 'Операция с подтверждением кода не выполнена',
  newPassword: 'Операция с созданием newPassword не выполнена',
  refreshToken: 'Некорректный refreshToken',

  noCurrentOwner: 'Вы не являетесь владельцем данной сессии для данной сессии',
  notFoundSession: 'Не найдена сессия с таким deviceId',
};
