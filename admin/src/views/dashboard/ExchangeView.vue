<script setup>
  import { ref } from "vue";
  import TitlePage from "../../components/TitlePage.vue";
  import { useExchanges } from "../../composables/exchanges";
  import { isoToEmoji } from "../../utils/isoToEmoji";
  import { useDisplay } from "vuetify/lib/framework.mjs";

  const { exchanges, isLoading, error } = useExchanges();
  const { smAndDown } = useDisplay();
  const isModalOpen = ref(null);
  console.log("🚀 ~ file: ExchangeView.vue:5 ~ exchanges:", exchanges.value);

  function addChange(item) {}
  function handleRemoveExchange(item) {}
</script>
<template>
  <TitlePage title="taux de changes" />

  <div align-items="center" class="d-flex align-top justify-space-around flex-wrap gap-5 mt-16" width="100%">
    <v-card v-if="exchanges" class="mx-3 my-3" max-width="500" min-width="250px" width="100%">
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
  </div>
</template>

<style lang="scss" scoped></style>
