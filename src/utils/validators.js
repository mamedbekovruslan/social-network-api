const EMAIL_REGEX = /^[\w.!#$%&'*+/=?^_`{|}~-]+@[\w-]+\.[\w.-]+$/i;

export function validateLoginPayload(payload) {
  const email = payload.email?.toString().trim().toLowerCase();
  const password = payload.password?.toString();

  if (!email || !EMAIL_REGEX.test(email)) {
    throw new Error('Укажите корректный email');
  }
  if (!password || password.length < 4) {
    throw new Error('Пароль должен содержать не менее 4 символов');
  }

  return { email, password };
}

export function validateRegisterPayload(payload) {
  const firstName = payload.firstName?.toString().trim();
  const lastName = payload.lastName?.toString().trim();
  const patronymic = payload.patronymic?.toString().trim() || null;
  const email = payload.email?.toString().trim().toLowerCase();
  const password = payload.password?.toString();
  const gender = payload.gender?.toString().trim().toLowerCase() || null;
  const ageValue = payload.age;
  const city = payload.city?.toString().trim() || null;

  if (!firstName || !lastName) {
    throw new Error('Введите имя и фамилию');
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    throw new Error('Укажите корректный email');
  }

  if (!password || password.length < 6) {
    throw new Error('Пароль должен содержать не менее 6 символов');
  }

  let age = null;
  if (typeof ageValue !== 'undefined' && ageValue !== null && ageValue !== '') {
    const parsed = Number.parseInt(ageValue, 10);
    if (!Number.isFinite(parsed) || parsed < 1 || parsed > 120) {
      throw new Error('Возраст должен быть числом от 1 до 120');
    }
    age = parsed;
  }

  return {
    firstName,
    lastName,
    patronymic,
    email,
    password,
    gender,
    age,
    city
  };
}
