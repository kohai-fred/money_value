<script setup>
  import { ref } from "vue";
  import TitlePage from "../components/TitlePage.vue";
  import { useChangeCurrency, useGetAllExchanges } from "../composables/home";
  import { formatLabel } from "../utils/formatLabel";
  import { reactive } from "vue";

  const { resultExchanges, errorExchanges } = useGetAllExchanges();
  const { resultChange, changeCurrency, isLoading, error } = useChangeCurrency();

  const BASE_URL = import.meta.env.VITE_BASE_API_URL;
  const code = ref();

  const exchangeResponse = {
    success: { pair: "jpy/eur", exchange_rate: "0.0080", amount: "200", calculated_amount: "1.6000" },
    error: {
      message: "Taux de change non trouvé",
    },
  };
  const pairsResponse = [
    {
      id: 47,
      currency_id_1: 13,
      currency_id_2: 11,
      exchange_rate: "0.6667",
      created_at: "2023-07-21T10:54:13.000000Z",
      updated_at: "2023-07-21T10:54:13.000000Z",
      currency_1: {
        id: 13,
        code: "JPY",
        name: "yen",
        created_at: "2023-07-21T10:44:50.000000Z",
        updated_at: "2023-07-21T10:44:50.000000Z",
      },
      currency_2: {
        id: 11,
        code: "EUR",
        name: "euro",
        created_at: "2023-07-21T10:09:25.000000Z",
        updated_at: "2023-07-21T10:09:25.000000Z",
      },
    },
  ];

  const formConvert = reactive({
    exchange: "",
    amount: "",
    codeIso1: "",
    codeIso2: "",
  });

  function findCodeIso(e) {
    const index = formConvert.exchange.split("-")[0];
    formConvert.codeIso1 = resultExchanges.value[+index].currency_1.code;
    formConvert.codeIso2 = resultExchanges.value[+index].currency_2.code;
  }

  async function submitForm() {
    await changeCurrency({
      codeIso1: formConvert.codeIso1,
      codeIso2: formConvert.codeIso2,
      amount: formConvert.amount,
    });
  }
</script>

<template>
  <TitlePage title="Bienvenue Sur Money value" />

  <article class="px-8 py-8">
    <section id="section-presentation" class="mb-16">
      <h2 class="mb-2">Monney Value c'est quoi ?</h2>
      <p>
        MoneyValue travaille dans le domaine de la finance. L’objectif de ce service public et gratuit est d’acquérir
        des données sur les conversions les plus demandées via une API REST.
      </p>
    </section>

    <section id="section-how-to-use" class="mb-16">
      <h2 class="mb-2">Comment fait-on pour l'utiliser ?</h2>
      <p>
        Pour ça rien de plus simple, il vous suffit d'utiliser ces routes
        <br />
        (elles commencerons toujours par :
        {{ BASE_URL }}):
      </p>
      <p class="font-italic py-1">
        <span class="font-weight-medium">Convertir 2 devises avec leur code ISO :</span>
        <br />
        <span class="font-weight-bold">/&lt;codeiso1&gt;/&lt;codeiso2&gt;/&lt;montant&gt;</span>
        <br />
        ex: /jpy/eur/200
        <br />
        <span class="text-caption">success :</span>
      </p>
      <div class="border rounded my-2">
        <pre v-highlightjs><code class="json">{{ exchangeResponse.success }}</code></pre>
      </div>
      <span class="text-caption">error :</span>
      <div class="border rounded my-2">
        <pre v-highlightjs><code class="json" color="green">{{ exchangeResponse.error }}</code></pre>
      </div>
      <p class="font-italic">
        <span class="font-weight-medium">Avoir la liste des codes iso :</span>
        <br />
        <span class="font-weight-bold">/pairs</span>
      </p>
      <div>
        <pre v-highlightjs><code class="json">{{ pairsResponse }}</code></pre>
      </div>
    </section>

    <section id="section-exchange" class="mb-16">
      <h2 class="mb-2">Convertir</h2>

      <template v-if="resultExchanges">
        <v-form @submit.prevent="submitForm" class="d-flex border rounded pt-5 px-5 mt-8">
          <v-row class="d-flex flex-wrap">
            <v-col cols="12" lg="4">
              <v-select
                label="Devise à convertir"
                v-model="formConvert.exchange"
                :items="
                  resultExchanges.map((curr, index) => {
                    return `${index} - ${formatLabel(curr)}`;
                  })
                "
                @update:modelValue="findCodeIso"
                density="compact"
                variant="underlined"
              ></v-select>
            </v-col>
            <v-col cols="12" lg="4">
              <v-text-field
                type="number"
                label="Montant"
                v-model="formConvert.amount"
                variant="underlined"
                density="compact"
              />
            </v-col>
            <v-col>
              <v-row class="d-flex flex-wrap">
                <v-col cols="auto" md="5" class="justify-center mx-auto">
                  <v-btn type="submit" density="default" class="ma-2">Convertir</v-btn>
                </v-col>
                <v-col cols="12" sm="6" class="d-flex align-center justify-center">
                  <p v-if="resultChange">{{ resultChange.calculated_amount }} {{ formConvert.codeIso2 }}</p>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-form>
      </template>
    </section>

    <section id="section-tips" class="mb-16">
      <h2 class="mb-2">Tips :</h2>
      <p>La base de données a déjà été remplie avec une dizaine de devises.</p>
      <p>
        Mais comme on sait que vous êtes impatient de rajouter des devises et des convertions, on vous laisse un accès à
        l'administration. Aller sur l'icône en haut à droite de la barre de navigation et cliquer sur le bouton "Login".
      </p>
      <p class="pt-2">
        Les credentials sont :
        <br />
        - email:
        <span class="font-italic">admin@example.com</span>
        <br />
        - password:
        <span class="font-italic">admin@example.com</span>
      </p>
      <p class="pt-2">
        Attention:
        <br />
        Les petits drapeaux sont basés sur les codes iso des pays.
      </p>
    </section>
  </article>
  <p v-if="error">{{ error }}</p>
</template>

<style scoped>
  .json {
    color: rgba(255, 217, 0, 0.665);
  }
</style>
