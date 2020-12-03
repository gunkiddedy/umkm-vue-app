<template>
  <div class="desa pa-4">
    <!--<v-data-table
      :headers="headers"
      :items="umkms"
      :search="search"
      :loading="loading"
      class="elevation-1"
    >-->
    <v-data-table
      :headers="headers"
      :items="umkms"
      :options.sync="options"
      :server-items-length="totalUkm"
      :loading="loading"
      :search="search"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>UMKM Desa {{ namaDesa }} </v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-text-field
            label="Search"
            single-line
            hide-details
            v-model="search"
          >
          </v-text-field>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                New Item
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.nama_usaha"
                        label="Nama Usaha"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.nama_pemilik"
                        label="Nama Pemilik"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.nik"
                        label="NIK"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.siu"
                        label="SIU"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.jenis_kelamin"
                        label="Jenis Kelamin"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
                <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="headline"
                >Are you sure you want to delete this item?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancel</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="getApiUmkm"> Reset </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      dialog: false,
      dialogDelete: false,
      search: "",
      loading: true,
      totalUkm: 0,
      options: {},
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
      umkms: [],
      namaDesa: "",
      editedIndex: -1,
      editedItem: {
        nama_usaha: "",
        nama_pemilik: "",
        nik: "",
        siu: "",
        jenis_kelamin: "",
      },
      defaultItem: {
        nama_usaha: "",
        nama_pemilik: "",
        nik: "",
        siu: "",
        jenis_kelamin: "",
      },
    };
  },
  mounted() {
    this.getApiUmkm();
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Data" : "Edit Data";
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    options: {
      handler() {
        this.getApiUmkm();
      },
      deep: true,
    },
  },
  // created() {
  //   this.getApiUmkm();
  // },
  methods: {
    getApiUmkm() {
      this.loading = true;
      axios
        .get("http://localhost:9000/api/ukms/" + 7)
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
          this.umkms = items;
          this.totalUkm = total;
          this.loading = false;
          this.namaDesa = response.data[0].desa;
          console.log("data nya ", response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    editItem(item) {
      this.editedIndex = this.umkms.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.umkms.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.umkms.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.umkms[this.editedIndex], this.editedItem);
      } else {
        this.umkms.push(this.editedItem);
      }
      this.close();
    },
  },
};
</script>
