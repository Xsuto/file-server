<script lang="ts" setup>
import FileSaver from 'file-saver';
const URL = `http://${window.location.hostname}:9003`;
const uploadURL = `${URL}/upload`;
const fileURL = `${URL}/file/`;
const ytURL = `${URL}/yt/`;

interface File {
  ID: string;
  originalName: string;
  extension?: string;
  createdAt: Date;
}

const youtubeLink = $ref('');
let files = $ref([]);
const { data: serverFiles, refresh } = $(
  await useFetch<File[]>(`${URL}/files`),
);

const formattedServerFiles = $computed(() =>
  serverFiles.map((it) => ({
    ...it,
    createdAt: `${it.createdAt.toString().split('T')[0]} ${
      it.createdAt.toString().split('T')[1].split('.')[0]
    }`,
  })),
);

const uploadYoutubeVideo = async () => {
  const url = ytURL + encodeURIComponent(youtubeLink);
  await useFetch(url);
  await refresh();
};

const handleFormSubmit = async (event: Event) => {
  const promises = [];
  for (const file of files) {
    const formData = new FormData();
    formData.append('file', file);
    promises.push(
      fetch(uploadURL, {
        method: 'POST',
        body: formData,
      }),
    );
  }
  await Promise.all(promises);
  await refresh();
};

const handleInputChange = (event) => {
  files = event.target.files;
};

const handleClick = (file: File) => {
  FileSaver.saveAs(fileURL + file.ID, file.originalName + file?.extension);
};
</script>

<template>
  <div>
    <form @submit.prevent="uploadYoutubeVideo">
      <input v-model="youtubeLink" />
      <button type="submit">Get yt video</button>
    </form>
    <form @submit.prevent="handleFormSubmit($event)">
      <label for="file">File</label>
      <input
        multiple
        name="file"
        required
        type="file"
        @change="handleInputChange($event)"
      />
      <button type="submit">Upload</button>
    </form>
    <p
      v-for="file in formattedServerFiles"
      :key="file"
      @click="handleClick(file)"
    >
      {{ file.originalName }} added at {{ file.createdAt }}
    </p>
  </div>
</template>

<style>
p {
  cursor: pointer;
}
</style>
