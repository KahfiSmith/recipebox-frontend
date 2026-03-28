# API Reference

Dokumen ini adalah referensi kontrak API untuk frontend di repo ini.

Status artefak generated saat ini:
- `docs/swagger.yaml` belum ada di repo ini.
- `docs/swagger.json` belum ada di repo ini.
- `scripts/swagger-generate.sh` juga belum ada di repo ini.

Implikasinya:
- Gunakan file ini sebagai acuan kontrak API dari sisi frontend.
- Bedakan dengan jelas antara endpoint yang sudah dipakai frontend saat ini dan endpoint yang masih target integrasi.

## Base URL
- Local: `http://localhost:8080`
- API prefix: `/api/v1`

## Main Endpoint Groups
- System:
  - `GET /healthz`
- Auth:
  - `POST /api/v1/auth/register`
  - `POST /api/v1/auth/login`
  - `POST /api/v1/auth/verify-email/request`
  - `POST /api/v1/auth/verify-email/confirm`
  - `POST /api/v1/auth/password/forgot`
  - `POST /api/v1/auth/password/reset`
  - `POST /api/v1/auth/refresh`
  - `POST /api/v1/auth/logout`
  - `GET /api/v1/auth/me`
- Dashboard / Menus:
  - `GET /api/v1/dashboard`
  - `GET /api/v1/recipes`
  - `POST /api/v1/recipes`
  - `PUT /api/v1/recipes/{id}`
  - `DELETE /api/v1/recipes/{id}`
  - `GET /api/v1/meal-plans`
  - `POST /api/v1/meal-plans`
  - `PUT /api/v1/meal-plans/{id}`
  - `DELETE /api/v1/meal-plans/{id}`
  - `GET /api/v1/shopping-items`
  - `POST /api/v1/shopping-items`
  - `PUT /api/v1/shopping-items/{id}`
  - `DELETE /api/v1/shopping-items/{id}`

## Status Integrasi Frontend Saat Ini

- Sudah dipakai frontend:
  - `POST /api/v1/auth/register`
  - `POST /api/v1/auth/login`
  - `POST /api/v1/auth/verify-email/request`
  - `POST /api/v1/auth/verify-email/confirm`
  - `POST /api/v1/auth/password/forgot`
  - `POST /api/v1/auth/password/reset`
  - `POST /api/v1/auth/refresh`
  - `POST /api/v1/auth/logout`
  - `GET /api/v1/auth/me`
  - `GET /api/v1/dashboard`
  - `GET /api/v1/recipes`
  - `POST /api/v1/recipes`
  - `PUT /api/v1/recipes/{id}`
  - `DELETE /api/v1/recipes/{id}`
  - `GET /api/v1/meal-plans`
  - `POST /api/v1/meal-plans`
  - `PUT /api/v1/meal-plans/{id}`
  - `DELETE /api/v1/meal-plans/{id}`
  - `GET /api/v1/shopping-items`
  - `POST /api/v1/shopping-items`
  - `PUT /api/v1/shopping-items/{id}`
  - `DELETE /api/v1/shopping-items/{id}`
- Belum dipakai frontend dan masih menjadi target kontrak backend:
  - Tidak ada pada kelompok endpoint utama saat ini.

## Pagination
- List endpoints support query params:
  - `limit` (default `20`, max `100`)
  - `offset` (default `0`)
- Applies to:
  - `GET /api/v1/recipes`
  - `GET /api/v1/meal-plans`
  - `GET /api/v1/shopping-items`

## Auth Contract Notes

Target contract yang dipakai frontend:
- `POST /api/v1/auth/login` dan `POST /api/v1/auth/refresh` diharapkan bekerja bersama refresh token berbasis cookie HTTP-only.
- `POST /api/v1/auth/logout` diharapkan mengakhiri session refresh yang sedang aktif.
- `GET /api/v1/auth/me` mengembalikan identitas user saat access token valid.

Normalisasi response yang saat ini didukung frontend:
- `POST /auth/login` menerima dua bentuk sukses:
  - `data.user` + `data.tokens.accessToken`
  - `data.user` + `data.accessToken`
- `POST /auth/refresh` menerima tiga bentuk sukses:
  - `data.accessToken`
  - `data.user` + `data.accessToken`
  - `data.user` + `data.tokens.accessToken`
- Jika `POST /auth/refresh` tidak mengembalikan user, frontend akan memanggil `GET /auth/me`.
- `POST /auth/register` saat ini mengharapkan sukses dalam bentuk `data.user`.
- Frontend saat ini mengasumsikan flow verifikasi email berbasis link. Setelah register sukses, user diarahkan ke halaman `/auth/verify-email?email=...` di frontend sebagai status/check-inbox page.
- Jika halaman `/auth/verify-email` dibuka dengan query `?token=...`, frontend akan langsung memanggil `POST /auth/verify-email/confirm` dengan payload:
  - `token`
- Tanda verifikasi email sukses dari sisi frontend adalah endpoint confirm mengembalikan sukses, misalnya `{"message":"email verified"}`, lalu user dapat login tanpa lagi kena error `email is not verified`.
- `POST /auth/password/reset` saat ini mengirim payload:
  - `token`
  - `newPassword`
- `GET /auth/me` menerima:
  - `data.user`
  - `data` langsung berisi user
- Frontend menormalisasi `user.id` numerik menjadi string di client state.

## Dashboard Response Notes

- Frontend saat ini mengharapkan `GET /api/v1/dashboard` dalam bentuk nested `data`.
- Field minimum yang dipakai frontend:
  - `data.summary.recipeCount`
  - `data.summary.upcomingMealPlanCount`
  - `data.summary.pendingShoppingItemCount`
  - `data.recipes`
  - `data.mealPlans`
  - `data.shoppingItems`

## Recipe Response Notes

- Frontend menerima response list recipe dalam beberapa bentuk berikut:
  - `data` berupa array recipe langsung
  - `data.recipes` + metadata pagination opsional
  - `data.items` + metadata pagination opsional
  - bentuk top-level setara tanpa wrapper `data`
- Frontend menerima response create/update recipe dalam beberapa bentuk berikut:
  - `data` langsung berisi recipe
  - `data.recipe`
  - recipe langsung di top-level
- Field recipe minimum yang dipakai frontend:
  - `id`
  - `name`
  - `category`
  - salah satu dari `prepTime`, `prepTimeMinutes`, atau `prep_time_minutes`

## Meal Plan Response Notes

- Frontend menerima response list meal plan dalam beberapa bentuk berikut:
  - `data` berupa array meal plan langsung
  - `data.mealPlans` + metadata pagination opsional
  - `data.items` + metadata pagination opsional
  - bentuk top-level setara tanpa wrapper `data`
- Frontend menerima response create/update meal plan dalam beberapa bentuk berikut:
  - `data` langsung berisi meal plan
  - `data.mealPlan`
  - meal plan langsung di top-level
- Field meal plan minimum yang dipakai frontend:
  - `id`
  - `day`
  - salah satu dari `mealName`, `meal_name`, `name`, atau `title`
  - salah satu dari `servings`, `servingCount`, atau `serving_count`
  - salah satu dari `ingredients`, `ingredientNames`, atau `ingredient_names`
  - salah satu dari `cooked`, `isCooked`, atau `is_cooked`
- Frontend saat ini mengirim payload create/update meal plan dalam bentuk:
  - `day`
  - `mealName`
  - `servings`
  - `ingredients`
  - `cooked`

## Shopping List Response Notes

- Frontend menerima response list shopping list dalam beberapa bentuk berikut:
  - `data` berupa array shopping item langsung
  - `data.shoppingItems` + metadata pagination opsional
  - `data.shoppingLists` + metadata pagination opsional
  - `data.items` + metadata pagination opsional
  - bentuk top-level setara tanpa wrapper `data`
- Frontend menerima response create/update shopping item dalam beberapa bentuk berikut:
  - `data` langsung berisi shopping item
  - `data.shoppingItem`
  - `data.shoppingList`
  - shopping item langsung di top-level
- Field shopping item minimum yang dipakai frontend:
  - `id`
  - salah satu dari `name`, `itemName`, `item_name`, atau `title`
  - salah satu dari `qty`, `quantity`, atau `amount`
  - opsional salah satu dari `checked`, `isChecked`, atau `is_checked`
  - opsional salah satu dari `source`, `sourceType`, atau `source_type`
  - opsional salah satu dari `sourceLabel`, `source_label`, `group`, `groupName`, `group_name`, `menuName`, atau `menu_name`
- Frontend saat ini mengirim payload create/update shopping item dalam bentuk:
  - `name`
  - `qty`
  - `checked`
  - `source`
  - `sourceLabel`
