import { configureStore } from '@reduxjs/toolkit';
import { mainSlice } from '../features/main/mainSlice';
import { bannerSlice } from '../features/Banners/bannerSlice';
import { categorySlice } from '../features/Category/categorySlice';
import { settingSlice } from '../features/Setting/settingSlice';
import { membersSlice } from '../features/Members/membersSlice';
import { apSlice } from '../features/AdditonalPacking/apSlice';
import { faqSlice } from '../features/Faq/faqSlice';
import { levelSlice } from '../features/Level/levelSlice';
import { usersSlice } from '../features/Users/usersSlice';
import { chatSlice } from '../features/Chat/chatSlice';
import { driversSlice } from '../features/Drivers/driversSlice';
import { transaksiSlice } from '../features/Transaksi/transaksiSlice';
import { vouchersSlice } from '../features/Vouchers/vouchersSlice';

export const store = configureStore({
  reducer: {
    main: mainSlice.reducer,
    banners: bannerSlice.reducer,
    categories: categorySlice.reducer,
    settings: settingSlice.reducer,
    members: membersSlice.reducer,
    additionalPacking: apSlice.reducer,
    faq: faqSlice.reducer,
    level: levelSlice.reducer,
    usersAdm: usersSlice.reducer,
    chats: chatSlice.reducer,
    drivers: driversSlice.reducer,
    transaksi: transaksiSlice.reducer,
    vouchers: vouchersSlice.reducer
  },
});
