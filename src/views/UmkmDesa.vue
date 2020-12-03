<template>
  <div class="umkm-desa pa-4">
    <v-text-field label="Search" single-line hide-details v-model="search">
    </v-text-field>
    <v-data-table
      :headers="headers"
      :items="desserts"
      :options.sync="options"
      :server-items-length="totalDesserts"
      :loading="loading"
      :search="search"
      class="elevation-1"
    ></v-data-table>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      totalDesserts: 0,
      desserts: [],
      umkms: [],
      loading: true,
      options: {},
      search: "",
      headers: [
        {
          text: "Nama Usaha",
          align: "start",
          sortable: true,
          value: "nama_usaha",
        },
        { text: "Pemilik", value: "nama_pemilik" },
        { text: "NIK", value: "nik" },
        { text: "SIU", value: "siu" },
        { text: "Gender", value: "jenis_kelamin" },
        { text: "Actions", value: "actions", sortable: false },
      ],
    };
  },
  watch: {
    options: {
      handler() {
        this.getApiUmkm();
      },
      deep: true,
    },
  },
  mounted() {
    this.getApiUmkm();
  },
  methods: {
    getApiUmkm() {
      this.loading = true;
      axios
        .get("http://localhost:9000/api/ukms/" + 1)
        .then((response) => {
          const { sortBy, sortDesc, page, itemsPerPage } = this.options;
          let items = response.data;
          const total = items.length;
          if (sortBy.length === 1 && sortDesc.length === 1) {
            items = items.sort((a, b) => {
              const sortA = a[sortBy[0]];
              const sortB = b[sortBy[0]];

              if (sortDesc[0]) {
                if (sortA < sortB) return 1;
                if (sortA > sortB) return -1;
                return 0;
              } else {
                if (sortA < sortB) return -1;
                if (sortA > sortB) return 1;
                return 0;
              }
            });
          }
          if (itemsPerPage > 0) {
            items = items.slice((page - 1) * itemsPerPage, page * itemsPerPage);
          }
          this.desserts = items;
          this.totalDesserts = total;
          this.loading = false;
          console.log("data nya ", response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
