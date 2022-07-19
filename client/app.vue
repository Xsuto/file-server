<script lang="ts" setup>
import FileSaver from 'file-saver'
const URL = `http://${window.location.hostname}:9003`
const uploadURL = `${URL}/upload`
const fileURL = `${URL}/file/`

interface File {
  ID: string
  originalName: string
  createdAt: Date
}

let files = $ref([])
const { data: serverFiles, refresh } = $(await useFetch<File[]>(`${URL}/files`))
const handleFormSubmit = async (event: Event) => {
  const promises = []
  for (const file of files) {
    const formData = new FormData()
    formData.append('file', file)
    promises.push(fetch(uploadURL, {
      method: 'POST',
      body: formData,
    }))
  }
  await Promise.all(promises)
  await refresh()
}
const handleInputChange = (event) => {
  files = event.target.files
}
const handleClick = (file: File) => {
  FileSaver.saveAs(fileURL + file.ID, file.originalName)
}
</script>

<template>
  <div>
    <form @submit.prevent="handleFormSubmit($event)">
      <label for="file">File</label>
      <input multiple name="file" required type="file" @change="handleInputChange($event)">
      <button type="submit">
        Upload
      </button>
    </form>
    <p v-for="file in serverFiles" :key="file" @click="handleClick(file)">
      {{ file.originalName }}
    </p>
  </div>
</template>

<style>
p {
  cursor: pointer;
}
</style>
