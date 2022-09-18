import { makeAutoObservable, runInAction } from "mobx";
import { history } from "../..";
import agent from "../api/agent";
import { User, UserFormValues } from "../models/user";
import { store } from "./store";

class UserStore {
  user: User | null = null;
  constructor() {
    makeAutoObservable(this);
  }
  get isLogedin() {
    return !!this.user;
  }

  login = async (creds: UserFormValues) => {
    try {
      const user = await agent.Account.login(creds);
      store.commonStore.setToken(user.token);
      runInAction(() => (this.user = user));
      history.push("/activities");
      console.log(user);
      store.modalStore.closeModal();
    } catch (error) {
      throw error;
    }
  };
  logout = () => {
    this.user = null;
    window.localStorage.removeItem("jwt");
    store.commonStore.setToken(null);
    history.push("/");
  };
  getUser = async () => {
    try {
      const user = await agent.Account.current();
      runInAction(() => (this.user = user));
    } catch (error) {
      console.log(error);
    }
  };
  register = async (creds: UserFormValues) => {
    try {
      const user = await agent.Account.register(creds);
      store.commonStore.setToken(user.token);
      runInAction(() => (this.user = user));
      history.push("/activities");
      console.log(user);
      store.modalStore.closeModal();
    } catch (error) {
      throw error;
    }
  };
}
export default UserStore;
