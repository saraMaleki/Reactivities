import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { Activity } from "../models/activity";
import { history } from '../..';
import { store } from "../stores/store";

axios.defaults.baseURL = "http://localhost:5000/api";

const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

axios.interceptors.response.use(
  async (response) => {
    await sleep(1000);
    return response;
  },
  (error: AxiosError|any) => {
    const { data, status,config } = error.response!;
    switch (status) {
      case 400:
        if(typeof data==='string'){
          toast.error("bad request");
        }
        if(config.method==='get' && data.errors.hasOwnProperty('id')){
        history.push('/not-found');
        }
        if(data.errors){
          const modalStateError=[];
          for(const key in data.errors)
          {
            if(data.errors[key])
            {
              modalStateError.push(data.errors[key])
            }
          }
          throw modalStateError.flat();
        }
        else{
          toast.error("bad request");
        }
        break;
      case 401:
        toast.error("unautorized");
        break;
      case 404:
        history.push('/not-found');
        // toast.error("not found");
        break;
      case 500:
        store.commonStore.setServerError(data);
        history.push('/server-error');
        // toast.error("server error");
        break;
    }
  }
  // try {
  //   await sleep(1000);
  //   return response;
  // } catch (err) {
  //   console.log(err);
  //   return await Promise.reject(err);
  // }
  // }
);

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: {}) =>
    axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
  del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const Activities = {
  list: () => requests.get<Activity[]>("/activities"),
  details: (id: string) => requests.get<Activity>(`/activities/${id}`),
  create: (activity: Activity) => requests.post<void>("/activities", activity),
  update: (activity: Activity) =>
    requests.put<void>(`/activities/${activity.id}`, activity),
  delete: (id: string) => requests.del<void>(`/activities/${id}`),
};

const agent = {
  Activities,
};

export default agent;
