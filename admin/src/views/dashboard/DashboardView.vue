<script setup>
  import { reactive } from "vue";
  import { useCurrencies } from "../../composables/currencies";
  import { ref } from "vue";
  import { createCurrency, updateCurrency, deleteCurrency } from "../../services/currencies";
  import { alertStore } from "../../store/alert.store";
  import { computed } from "vue";
  import Modal from "../../components/Modal.vue";
  const { currencies, isLoading, error } = useCurrencies();
  const { showAlert } = alertStore();

  const isModalOpen = ref(false);
  const isIdUpdate = ref(false);
  const formState = ref();
  const formCurrency = reactive({
    name: "",
    code: "",
  });

  const rules = {
    required: (value) => !!value || "Champs obligatoire",
    strict: (value, nb) => value.length === nb || `Le champs doit comporté uniquement ${nb} caractères`,
    between: (value, min, max) =>
      (value.length <= max && value.length >= min) || `Le champs doit être compris entre ${min} et ${max} caractères`,
    onlyString: (value) => !!/^[a-zA-Z]+$/.test(value) || "Uniquement des lettres",
    onlyStringAndSpace: (value) => !!/^[a-zA-Z\s]+$/.test(value) || "Uniquement des lettres",
  };

  async function submitForm() {
    if (formState.value) {
      const newFormCurrency = {
        name: formCurrency.name.toLowerCase().trim(),
        code: formCurrency.code.toUpperCase().trim(),
      };

      // errorMessage.value = null
      try {
        const newCurrencies = !isIdUpdate.value
          ? await createCurrency(newFormCurrency)
          : await updateCurrency(isIdUpdate.value, newFormCurrency);

        currencies.value = newCurrencies;
        clearForm();

        showAlert.value({
          color: "success",
          title: `La devise ${newFormCurrency.name} à bien été ${isIdUpdate.value ? "modifée" : "ajoutée"}`,
        });
      } catch (error) {
        console.error("🚀 ~ file: DashboardView.vue:41 ~ submitForm ~ error:", error);
        showAlert.value({ color: "error", title: "Une erreur est survenue" });
        // errorMessage.value = error.message
      }
    }
  }

  function addChange(currency) {
    formCurrency.code = currency.code;
    formCurrency.name = currency.name;
    isIdUpdate.value = currency.id;
  }

  async function handleRemoveCurrency(currency) {
    try {
      const newCurrencies = await deleteCurrency(currency);
      currencies.value = newCurrencies;
      isModalOpen.value = false;
      showAlert.value({
        color: "success",
        title: `La devise ${currency.name} à bien été supprimée`,
      });
    } catch (error) {
      console.error("🚀 ~ file: DashboardView.vue:41 ~ handleRemoveCurrency ~ error:", error);
      showAlert.value({ color: "error", title: "Une erreur est survenue" });
    }
  }

  function clearForm() {
    formCurrency.code = "";
    formCurrency.name = "";
    isIdUpdate.value = null;
  }
  console.log("🆘 FORM ", formCurrency);
</script>

<template>
  <p class="text-h4 text-center text-capitalize my-8">les devises</p>

  <div align-items="center" class="d-flex align-top justify-space-around flex-wrap gap-5 mt-16" width="100%">
    <v-card v-if="currencies" class="mx-3 my-3" max-width="500" min-width="250px" width="100%">
      <v-card-title>Les devises existantes</v-card-title>

      <v-divider></v-divider>

      <v-virtual-scroll :items="currencies" height="320" item-height="48">
        <template v-slot:default="{ item }">
          <v-list-item>
            <template v-slot:prepend>
              <v-icon color="green-darken-1">mdi mdi-cash</v-icon>
            </template>
            {{ item.name }}
            <template v-slot:append>
              <v-btn
                size="x-small"
                color="info"
                variant="outlined"
                icon="mdi mdi-pencil-outline"
                class="mr-2"
                @click="() => addChange(item)"
              ></v-btn>
              <!-- MODAL -->
              <v-btn size="x-small" color="error" variant="outlined" icon="mdi mdi-trash-can-outline">
                <v-icon color="error">mdi mdi-trash-can-outline</v-icon>
                <v-dialog v-model="isModalOpen" activator="parent" width="auto">
                  <v-card>
                    <v-card-text>
                      Vous êtes sur le point d'effacer définitivement la devise.
                      <br />
                      L'action est irreversible
                    </v-card-text>
                    <v-card-actions>
                      <v-row>
                        <v-col>
                          <v-btn color="primary" variant="outlined" block @click="isModalOpen = false">Annuler</v-btn>
                        </v-col>
                        <v-col>
                          <v-btn color="error" variant="outlined" block @click="() => handleRemoveCurrency(item)">
                            Supprimer
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-btn>
            </template>
          </v-list-item>
        </template>
      </v-virtual-scroll>
    </v-card>

    <!-- FORM -->

    <v-card class="d-flex flex-column justify-space-between mx-3 my-3" max-width="500" min-width="250px" width="100%">
      <div>
        <v-card-title>
          {{ isIdUpdate ? `Modifier - ${formCurrency.name}` : "Ajouter une nouvelle devise" }}
        </v-card-title>
        <v-divider class="mb-4"></v-divider>
      </div>
      <v-form
        id="currencyForm"
        class="mb-8 px-8"
        min-height="320"
        @submit.prevent="submitForm"
        validate-on="blur"
        v-model="formState"
      >
        <v-text-field
          class="mb-2"
          density="comfortable"
          label="Nom de la devise"
          v-model="formCurrency.name"
          :rules="[rules.required, rules.onlyStringAndSpace, rules.between(formCurrency.name, 3, 20)]"
        />
        <v-text-field
          class="mb-2"
          density="comfortable"
          label="Code ISO"
          v-model="formCurrency.code"
          :rules="[rules.required, rules.strict(formCurrency.code, 3), rules.onlyString]"
        />
      </v-form>
      <v-card-actions class="px-8 mb-2">
        <v-row>
          <v-col>
            <v-btn
              block
              @click="clearForm"
              color="red"
              :disabled="!formCurrency.code || !formCurrency.name"
              :variant="!formCurrency.code || !formCurrency.name ? 'text' : 'flat'"
            >
              Annuler
            </v-btn>
          </v-col>
          <v-col>
            <v-btn type="submit" form="currencyForm" block :color="isIdUpdate ? 'primary' : 'teal'" variant="flat">
              {{ isIdUpdate ? "Modifier" : "Ajouter" }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </div>
</template>

<style lang="scss" scoped></style>
