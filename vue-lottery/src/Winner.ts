export interface IWinner {
  name: string
  dob: string
  email: string
  phone: string
}

export default class Winner implements IWinner {
  constructor(
    public name: string,
    public dob: string,
    public email: string,
    public phone: string
  ) {}
}
