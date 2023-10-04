import Storage from "./Storage";

class CalorieTracker {
  constructor() {
    this._calorieLimit = Storage.getCalorieLimit();
    this._totalCalories = Storage.getTotalCalories();
    this._meals = Storage.getMeals();
    this._workouts = Storage.getWorkouts();

    this._displayCaloriesConsumed();
    this._displayCalorieLimit();
    this._displayCaloriesTotal();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();

    document.getElementById("limit").placeholder = this._calorieLimit;
  }

  // Public methods/API

  addMeal(meal) {
    this._meals.push(meal);
    this._totalCalories += meal.calories;
    Storage.updateTotalCalories(this._totalCalories);
    Storage.saveMeal(meal);
    this._displayNewMeal(meal);
    this._render();
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.calories;
    Storage.updateTotalCalories(this._totalCalories);
    Storage.saveWorkout(workout);
    this._displayNewWorkout(workout);
    this._render();
  }

  removeMeal(id) {
    const index = this._meals.findIndex((meal) => meal.id === id);

    if (index !== -1) {
      const meal = this._meals[index];
      this._totalCalories -= meal.calories;
      Storage.updateTotalCalories(this._totalCalories);
      this._meals.splice(index, 1);
      Storage.removeMeal(id);
      this._render();
    }
  }

  removeWorkout(id) {
    const index = this._workouts.findIndex((workout) => workout.id === id);

    if (index !== -1) {
      const workout = this._workouts[index];
      this._totalCalories += workout.calories;
      Storage.updateTotalCalories(this._totalCalories);
      Storage.removeWorkout(id);
      this._workouts.splice(index, 1);
      this._render();
    }
  }

  reset() {
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];
    Storage.resetStorage();
    this._render();
  }

  setLimit(value) {
    this._calorieLimit = value;
    Storage.setCalorieLimit(value);
    this._displayCalorieLimit();
    this._render();
  }

  displayItemsFromStorage() {
    if (localStorage.getItem("meals") !== -1) {
      const meals = JSON.parse(localStorage.getItem("meals"));
      if (meals) {
        meals.forEach((meal) => this._displayNewMeal(meal));
      }
    }
    if (localStorage.getItem("workouts") !== -1) {
      const workouts = JSON.parse(localStorage.getItem("workouts"));
      if (workouts) {
        workouts.forEach((workout) => this._displayNewWorkout(workout));
      }
    }
  }

  // Private Methods

  _displayCaloriesConsumed() {
    const caloriesCosumedEl = document.getElementById("calories-consumed");
    const caloriesConsumed = this._meals.reduce(
      (total, meal) => total + meal.calories,
      0
    );
    caloriesCosumedEl.innerText = caloriesConsumed;
  }

  _displayCaloriesBurned() {
    const caloriesBurnedEl = document.getElementById("calories-burned");
    const caloriesBurned = this._workouts.reduce(
      (total, workout) => total + workout.calories,
      0
    );
    caloriesBurnedEl.innerText = caloriesBurned;
  }

  _displayCaloriesTotal() {
    const totalCaloriesEl = document.getElementById("calories-total");
    totalCaloriesEl.innerHTML = this._totalCalories;
  }

  _displayCaloriesRemaining() {
    const caloriesRemainingEl = document.getElementById("calories-remaining");
    const total = this._calorieLimit - this._totalCalories;
    caloriesRemainingEl.innerHTML = total;

    if (total <= 0) {
      caloriesRemainingEl.parentElement.parentElement.classList.remove(
        "bg-light"
      );
      caloriesRemainingEl.parentElement.parentElement.classList.add(
        "bg-danger"
      );
    } else {
      caloriesRemainingEl.parentElement.parentElement.classList.remove(
        "bg-danger"
      );
      caloriesRemainingEl.parentElement.parentElement.classList.add("bg-light");
    }
  }

  _displayCalorieLimit() {
    const calorieLimitEl = document.getElementById("calories-limit");
    calorieLimitEl.innerHTML = this._calorieLimit;
  }

  _displayCaloriesProgress() {
    const percentage = (this._totalCalories / this._calorieLimit) * 100;
    const width = Math.min(percentage, 100);
    const progressBarEl = document.getElementById("calorie-progress");
    progressBarEl.style.width = `${width}%`;
    if (this._totalCalories >= this._calorieLimit) {
      progressBarEl.classList.remove("bg-success");
      progressBarEl.classList.add("bg-danger");
    } else {
      progressBarEl.classList.remove("bg-danger");
      progressBarEl.classList.add("bg-success");
    }
  }

  _displayNewMeal(meal) {
    const mealItemEl = document.createElement("div");
    mealItemEl.classList.add("card", "my-2");
    mealItemEl.setAttribute("data-id", meal.id);
    mealItemEl.innerHTML = `
                  <div class="card-body">
                    <div class="d-flex align-items-center justify-content-between">
                      <h4 class="mx-1">${meal.name}</h4>
                      <div
                        class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                      >
                        ${meal.calories}
                      </div>
                      <button class="delete btn btn-danger btn-sm mx-2">
                        <i class="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  </div>
        `;
    document.getElementById("meal-items").appendChild(mealItemEl);
  }

  _displayNewWorkout(workout) {
    const workoutItemEl = document.createElement("div");
    workoutItemEl.classList.add("card", "my-2");
    workoutItemEl.setAttribute("data-id", workout.id);
    workoutItemEl.innerHTML = `
        <div class="card-body">
            <div class="d-flex align-items-center justify-content-between">
                <h4 class="mx-1">${workout.name}</h4>
                <div class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5">
                    ${workout.calories}
                </div>
                <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        </div>
        `;
    document.getElementById("workout-items").appendChild(workoutItemEl);
  }

  _render() {
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();
  }
}

export default CalorieTracker;
