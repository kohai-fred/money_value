import { ref } from "vue";
import { emptyMenu, dashboardMenu, homeMenu } from "../router/menu";
import { userStore } from "../store/user.store";

export function useMenu() {
  const menuList = ref();
  const { token } = userStore();

  const menu = dashboardMenu.concat(homeMenu);

  menuList.value = token.value ? menu : homeMenu;

  return { menuList };
}
