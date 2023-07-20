import { ref } from "vue";
import { emptyMenu, dashboardMenu } from "../router/menu";
import { userStore } from "../store/user.store";

export function useMenu() {
  const menuList = ref();
  const { token } = userStore();

  menuList.value = token.value ? dashboardMenu : emptyMenu;

  return { menuList };
}
