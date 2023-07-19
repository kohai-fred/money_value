<script setup>
  import { reactive, ref } from "vue";
  import axios from "axios";
  import { userStore } from "../store/user.store.js";
  import { useRouter } from "vue-router";
  import { alertStore } from "../store/alert.store";
  const BASE_URL = import.meta.env.VITE_BASE_API_URL;

  const router = useRouter();
  const { setToken, token } = userStore();
  const { showAlert } = alertStore();

  const formState = ref();

  const formUser = reactive({
    email: "",
    password: "",
  });

  const rules = {
    required: (value) => !!value || "Champs obligatoire.",
  };

  function submitForm() {
    if (formState.value) {
      try {
        axios.post(`${BASE_URL}/login`, formUser).then((res) => {
          console.log("🆘 RES", res);
          const { data } = res;
          if (data.status === 200) {
            setToken.value(res.data.token);
            router.push({ name: "dashboard" });
            return;
          }
          showAlert.value({ color: "error", title: data.message });
        });
      } catch (error) {
        console.error("Une erreur est survenue", error.message);
      }
    }
  }
</script>
<template>
  <div class="d-flex align-center" min-height="50vh">
    <v-card width="400" class="mx-auto my-5" title="Formulaire de connexion">
      <v-form validate-on="blur" class="mb-8" @submit.prevent="submitForm" v-model="formState">
        <v-row no-gutters>
          <v-col cols="12" class="px-3">
            <v-text-field
              class="mb-2"
              density="comfortable"
              label="Email"
              v-model="formUser.email"
              :rules="[rules.required]"
              type="email"
            />
            <v-text-field
              class="mb-2"
              density="comfortable"
              label="Password"
              type="password"
              v-model="formUser.password"
              :rules="[rules.required]"
            />
            <v-btn type="submit" block color="teal" variant="flat">Connexion</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </div>
</template>

<style lang="scss" scoped></style>
