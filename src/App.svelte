<script>
	export let name;
</script>

<main>
    <form class="form">
      <p class="form__message">Error</p>
      <h3>Email form</h3>
      <div class="form__loader">
        <div class="loader">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div class="form__section">
        <input type="text" name="namename" placeholder="Name" />
        <input type="email" name="email" placeholder="Email" />
      </div>
      <div class="form__section">
        <textarea name="text" placeholder="Message"></textarea>
      </div>
      <button class="form__submit">Send</button>
    </form>
</main>

<style>
	:root {
  --loader: #fff;
  --background-color: 256, 256, 256;
  --light-color: 238, 238, 238;
  --dark-color: 0, 0, 0;
  --success-color: 0, 256, 0;
  --error-color: 256, 0, 0;
  --background-items: 0, 220, 220;
}
body {
  margin: 0;
  display: flex;
  max-width: 100%;
  height: 100vh;
}
* {
  box-sizing: border-box;
}
.form {
  padding: 20px;
  width: 500px;
  margin: auto;
  display: grid;
  gap: 20px;
  position: relative;
  border: 1px solid;
}

.form__loader {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--background-items);
  visibility: hidden;
}

.form__section {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.form input,
.form textarea,
.form button {
  background-color: var(--background-items);
  outline: none;
  border: 1px;
  border-radius: 5px;
  padding: 10px;
}

.form input {
  width: 200px;
}

.form textarea {
  height: 200px;
  width: 100%;
  resize: none;
}

.form button {
  width: 100px;
  cursor: pointer;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.form__message {
  visibility: hidden;
  margin-top: 0;
  margin-bottom: 0;
  background: var(--background-color);
  position: absolute;
  padding: 10px;
  top: -60px;
  left: 0;
  width: 100%;
  border-radius: 5px;
  color: var(--success-color);
  border: 1px solid var(--success-color);
}

.form__error {
  color: var(--error-color);
  border: 1px solid var(--error-color);
}
.loader {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.loader div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 64px;
  height: 64px;
  margin: 8px;
  border: 8px solid var(--loader);
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: var(--loader) transparent transparent transparent;
}
.loader div:nth-child(1) {
  animation-delay: -0.45s;
}
.loader div:nth-child(2) {
  animation-delay: -0.3s;
}
.loader div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes loader {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>