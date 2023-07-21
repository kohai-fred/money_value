<script setup>
  import { ref } from "vue";
  import TitlePage from "../../components/TitlePage.vue";
  import { useExchanges, useAvailableExchanges } from "../../composables/exchanges";
  import { isoToEmoji } from "../../utils/isoToEmoji";
  import { useDisplay } from "vuetify/lib/framework.mjs";
  import { reactive } from "vue";
  import { createExchange } from "../../services/exchanges";
  import { alertStore } from "../../store/alert.store";

  const { exchanges, isLoading, error } = useExchanges();
  const { availableExchanges, fetchAvailableExchanges } = useAvailableExchanges();
  const { showAlert } = alertStore();
  const { smAndDown } = useDisplay();

  const isModalOpen = ref(null);
  const exchangeUpdate = ref(false);

  const indexPair1 = ref(null);
  const indexPair2 = ref(null);

  function getIdPair(index) {
    return {
      currency_id_1: availableExchanges.value[+index].currency_1.id,
      currency_id_2: availableExchanges.value[+index].currency_2.id,
    };
  }

  const onPairSelected = () => {
    indexPair1.value = formExchange.exchange_1.split("-")[0];
    const { currency_id_1, currency_id_2 } = getIdPair(indexPair1.value);

    for (let i = 0; i < availableExchanges.value.length; i++) {
      const element = availableExchanges.value[i];
      const id1 = element.currency_1.id;
      const id2 = element.currency_2.id;
      if (id2 === currency_id_1 && id1 === currency_id_2) {
        indexPair2.value = i;
        break;
      }
    }
    formExchange.exchange_2 = availableExchanges.value[indexPair2.value];
  };

  function countRate2() {
    formExchange.exchange_rate_1 = (+formExchange.exchange_rate_1).toFixed(4);
    formExchange.exchange_rate_2 = (1 / formExchange.exchange_rate_1).toFixed(4);
  }

  const formState = ref();
  const formExchange = reactive({
    exchange_1: "",
    exchange_2: "",
    exchange_rate_1: "",
    exchange_rate_2: "",
  });

  function addChange(item) {}
  function handleRemoveExchange(item) {}

  function clearForm() {
    formExchange.exchange_1 = "";
    formExchange.exchange_2 = "";
    formExchange.exchange_rate_1 = "";
    formExchange.exchange_rate_2 = "";
  }

  async function submitForm() {
    const request1 = {
      ...getIdPair(indexPair1.value),
      exchange_rate: formExchange.exchange_rate_1,
    };
    const request2 = {
      ...getIdPair(indexPair2.value),
      exchange_rate: formExchange.exchange_rate_2,
    };

    try {
      const [res1, res2] = await createExchange(request1, request2);
      exchanges.value = res2 > res1 ? res2 : res1;
      await fetchAvailableExchanges();
      clearForm();
      showAlert.value({
        color: "success",
        title: `Les conversions ont bien été ${exchangeUpdate.value ? "modifées" : "ajoutées"}`,
      });
    } catch (err) {
      console.error("📛 Error create exchange", err);
      showAlert.value({ color: "error", title: "Une erreur est survenue" });
    }
  }
</script>

<template>
  <TitlePage title="taux de changes" />

  <div align-items="center" class="d-flex align-top justify-space-around flex-wrap gap-5 mt-16" width="100%">
    <v-card v-if="exchanges" class="mx-3 my-3" max-width="750" min-width="250px" width="100%">
      <v-card-title>Les devises existantes</v-card-title>

      <v-divider></v-divider>

      <v-virtual-scroll :items="exchanges" height="320" item-height="48">
        <template v-slot:default="{ item }">
          <v-list-item>
            <!-- <template v-slot:prepend>
            </template> -->
            <span class="d-flex align-center flex-wrap">
              <span class="mr-2">
                {{ isoToEmoji(item.currency1.code) }}
              </span>
              {{ item.currency1.name }}
              <span class="mdi mdi-arrow-right-thin mx-2"></span>
              <div>
                {{ item.currency2.name }}
                <span class="ml-2">{{ isoToEmoji(item.currency2.code) }}</span>
              </div>
              <div>
                <span class="mdi mdi-arrow-right-thin mx-2"></span>
                {{ item.exchange_rate }}
              </div>
            </span>
            <v-divider v-if="smAndDown" />
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
                      Vous êtes sur le point d'effacer définitivement la convertion.
                      <br />
                      L'action est irreversible
                    </v-card-text>
                    <v-card-actions>
                      <v-row>
                        <v-col>
                          <v-btn color="primary" variant="outlined" block @click="isModalOpen = false">Annuler</v-btn>
                        </v-col>
                        <v-col>
                          <v-btn color="error" variant="outlined" block @click="() => handleRemoveExchange(item)">
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

    <!-- !FORM -->
    <v-card
      v-if="availableExchanges"
      class="d-flex flex-column justify-space-between mx-3 my-3"
      max-width="750"
      min-width="250px"
      width="100%"
    >
      <div>
        <v-card-title>
          {{
            exchangeUpdate
              ? `Modifier - ${exchangeUpdate.currency1.name} & ${exchangeUpdate.currency2.name}`
              : "Ajouter une nouvelle devise"
          }}
        </v-card-title>
        <v-divider class="mb-4"></v-divider>
      </div>
      <v-form
        id="exchangeForm"
        class="mb-8 px-8"
        min-height="320"
        @submit.prevent="submitForm"
        validate-on="blur"
        v-model="formState"
      >
        <v-row>
          <v-col>
            <v-select
              label="Devises 1"
              v-model="formExchange.exchange_1"
              :items="
                availableExchanges.map((curr, index) => {
                  return `${index} - ${isoToEmoji(curr.currency_1.code)} ${curr.currency_1.name} → ${
                    curr.currency_2.name
                  } ${isoToEmoji(curr.currency_2.code)}`;
                })
              "
              @update:modelValue="onPairSelected"
            ></v-select>
          </v-col>
          <v-col>
            <v-text-field
              type="number"
              class="mb-2"
              density="default"
              label="Taux de change 1"
              v-model="formExchange.exchange_rate_1"
              @blur="countRate2"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              :label="
                formExchange.exchange_2
                  ? `${isoToEmoji(formExchange.exchange_2.currency_1.code)} ${
                      formExchange.exchange_2.currency_1.name
                    } → ${formExchange.exchange_2.currency_2.name} ${isoToEmoji(
                      formExchange.exchange_2.currency_2.code
                    )}`
                  : ''
              "
              disabled
            />
          </v-col>
          <v-col>
            <v-text-field
              type="number"
              class="mb-2"
              density="default"
              label="Taux de change 2"
              v-model="formExchange.exchange_rate_2"
              :disabled="!formExchange.exchange_rate_1"
            />
          </v-col>
        </v-row>
      </v-form>
      <v-card-actions class="px-8 mb-2">
        <v-row>
          <v-col>
            <v-btn
              block
              @click="clearForm"
              color="red"
              :disabled="!formExchange.exchange_1 && !formExchange.exchange_rate_1 && !formExchange.exchange_rate_2"
              :variant="
                !formExchange.exchange_1 && !formExchange.exchange_rate_1 && !formExchange.exchange_rate_2
                  ? 'outlined'
                  : 'flat'
              "
            >
              Annuler
            </v-btn>
          </v-col>
          <v-col>
            <v-btn
              :disabled="!formExchange.exchange_1 || !formExchange.exchange_rate_1 || !formExchange.exchange_rate_2"
              type="submit"
              form="exchangeForm"
              block
              :color="exchangeUpdate ? 'primary' : 'teal'"
              :variant="
                !formExchange.exchange_1 || !formExchange.exchange_rate_1 || !formExchange.exchange_rate_2
                  ? 'outlined'
                  : 'flat'
              "
            >
              {{ exchangeUpdate ? "Modifier" : "Ajouter" }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </div>
</template>

<style lang="scss" scoped></style>
