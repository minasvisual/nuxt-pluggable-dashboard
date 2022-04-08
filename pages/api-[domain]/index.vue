<template>
  <section class="mx-12">
    <CrudForm :model="model" :data="form" />
    <CrudTable :model="model" :resource="resource" @edit="actions" @delete="actions" />
  </section>
</template>

<script setup>
  import _ from 'lodash'

  let route = useRoute() 
    
  let form = ref({})
  let model = {
    "type": "object",
    "title": "Cursos",
    "domain": "cursos",
    "properties": [
      {
        "name": "title",
        "label": "Title",
        "config": {
          "grid": true
        }
      },
      {
        "name": "tags",
        "label": "Tags",
        "config": {
          "grid": true
        }
      },
      {
        "name": "url",
        "label": "URL"
      },
      {
        "name": "lang",
        "label": "LANG",
        "config": {
          "grid": true,
          "sort": 3
        }
      }
    ],
    "api": {
      "rootApi": "https://api.mantovaniarts.com/cursos/courses",
      "wrapData": "rows",
      "totalData": "count",
      "urlGetById": "/{id}",
      "pagination": {
        "pageField": "page",
        "limitField": "limit",
        "sortField": "sort",
        "sortExp": "{sort}{prop}",
        "sortAscChar": "",
        "sortDescChar": "-",
        "filterField": "filter",
        "filterExp": "{prop},like,%{value}%"
      },
      "params": {
        "limit": 5,
        "sort": "-id"
      }
    }
  }

  let actions = ({ target, row }) => {
    console.log(target, row)
    if( target == 'delete')
      console.log("delete", row)
    else
      form.value = JSON.parse(JSON.stringify(row)) 
  }

  const { data:resource } = await useAsyncData('data_'+route.params.domain, ({ $axios }) => {  
    return $axios({ url: model.api.rootApi }).then(({ data }) => _.get(data, model.api.wrapData, data))
  })
</script>