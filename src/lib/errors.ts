export class AuthenticationError extends Error {
  constructor() {
    super("Unauthenticated");
    this.name = "Unauthenticated";
  }
}

export class AuthorizationError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "Unauthorized";
  }
}

export class NotFoundError extends Error {
  constructor() {
    super("Not found");
    this.name = "Not found";
  }
}

export class InputError extends Error {
  constructor() {
    super("Invalid input");
    this.name = "Invalid input";
  }
}
