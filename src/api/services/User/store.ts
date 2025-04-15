import { makeAutoObservable, runInAction } from "mobx";
import {
  ActionError,
  ActionResultStatus,
  ActionSuccess
} from "../../../types/global";
import { resultOrError, ResultOrErrorResponse } from "../../../utils/global";

export interface User {
  firstName?: string;
  lastName?: string;
  eMail?: string;
  avatarUrl?: string;
}

export default class UserStore {
  user: User | null = null;

  // init function
  constructor() {
    makeAutoObservable(this);
  }

  // actions
  async getOwnUser(): Promise<ActionSuccess<User> | ActionError> {
    try {
      const [result, error] = (await resultOrError(
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                firstName: "Aria",
                lastName: "Test",
                eMail: "linda.bolt@osapiens.com",
                avatarUrl: "https://example.com/avatar.jpg"
              }),
            500
          )
        )
      )) as ResultOrErrorResponse<User>;

      if (error) {
        return {
          status: ActionResultStatus.ERROR,
          error
        } as ActionError;
      } else if (result) {
        runInAction(() => {
          this.user = result; // Corrected typo
        });

        return {
          status: ActionResultStatus.SUCCESS,
          result
        } as ActionSuccess<User>;
      } else {
        return {
          status: ActionResultStatus.ERROR,
          error: "Unexpected error: No result returned."
        } as ActionError;
      }

      // if (error) {
      //   return {
      //     status: ActionResultStatus.ERROR,
      //     error
      //   } as ActionError;
      // }

      // if (result) {
      //   runInAction(() => {
      //     this.user = result; // Corrected typo
      //   });

      //   return {
      //     status: ActionResultStatus.SUCCESS,
      //     result
      //   } as ActionSuccess<User>;
      // }

      // return {
      //   status: ActionResultStatus.ERROR,
      //   error: "Unexpected error: No result returned."
      // } as ActionError;
    } catch (err) {
      return {
        status: ActionResultStatus.ERROR,
        error: err
      } as ActionError;
    }
  }
}
