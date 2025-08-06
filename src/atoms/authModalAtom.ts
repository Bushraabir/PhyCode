import { atom } from "recoil";

export interface AuthModalState {
  isOpen: boolean;
  type: "login" | "register" | "forgotPassword";
}

const defaultModalState: AuthModalState = {
  isOpen: false,
  type: "login",
};

export const authModalState = atom<AuthModalState>({
  key: "authModalState",
  default: defaultModalState,
});