import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'rsuite/dist/styles/rsuite-default.css';

import MyContent from './pages/MyContent';
import { Login, Main, PageLoading } from './Template';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ProtectedRoute from './router/ProtectedRoute';
import PublicRoute from './router/PublicRoute';

const Banner = React.lazy(() => import('./features/Banners'));
const Home = React.lazy(() => import('./features/Beranda'));
const Category = React.lazy(() => import('./features/Category'));
const Setting = React.lazy(() => import('./features/Setting'));
const Members = React.lazy(() => import('./features/Members'));
const AdditonalPacking = React.lazy(() => import('./features/AdditonalPacking'));
const Faq = React.lazy(() => import('./features/Faq'));
const FormFaq = React.lazy(() => import('./features/Faq/FaqForm'));
const FaqDriver = React.lazy(() => import('./features/Faq/FaqDriver'));
const Level = React.lazy(() => import('./features/Level'));
const Users = React.lazy(() => import('./features/Users'));
const Chat = React.lazy(() => import('./features/Chat'));
const Drivers = React.lazy(() => import('./features/Drivers'));
const WaitingPayment = React.lazy(() => import('./features/Transaksi/WaitingPayment'));
const PaymentCompleted = React.lazy(() => import('./features/Transaksi/PaymentCompleted'));
const OnProcess = React.lazy(() => import('./features/Transaksi/OnProcess'));
const Completed = React.lazy(() => import('./features/Transaksi/Completed'));
const TransDetail = React.lazy(() => import('./features/Transaksi/TransDetail'));
const Vouchers = React.lazy(() => import('./features/Vouchers'));
const FormVoucher = React.lazy(() => import('./features/Vouchers/FormVoucher'));

const getBasename = path => path.substr(0, path.lastIndexOf('/'));

function App() {
  return (
    <div className="App">
      <Router basename={getBasename(window.location.pathname)}>
        <Switch>
          <PublicRoute exact path="/login">
            <Login />
          </PublicRoute>

          <PublicRoute exact path="/test">
            <PageLoading />
          </PublicRoute>


          <ProtectedRoute path="/">
            <Main>
              <React.Suspense fallback={<PageLoading />}>
                <Route exact path="/" component={Home} />
                <Route exact path="/cooljek" component={Home} />
                <Route exact path="/banner" component={Banner} />
                <Route exact path="/category" component={Category} />
                <Route exact path="/setting" component={Setting} />
                <Route exact path="/members" component={Members} />
                <Route exact path="/ap" component={AdditonalPacking} />
                <Route exact path="/faq_cust" component={Faq} />
                <Route exact path="/faq_driver" component={FaqDriver} />
                <Route exact path="/add_faq" component={FormFaq} />
                <Route exact path="/level" component={Level} />
                <Route exact path="/users" component={Users} />
                <Route exact path="/chat" component={Chat} />
                <Route exact path="/drivers" component={Drivers} />
                <Route exact path="/waiting_payment" component={WaitingPayment} />
                <Route exact path="/payment" component={PaymentCompleted} />
                <Route exact path="/onprocess" component={OnProcess} />
                <Route exact path="/completed" component={Completed} />
                <Route exact path="/trans_detail" component={TransDetail} />
                <Route exact path="/vouchers" component={Vouchers} />
                <Route exact path="/add_voucher" component={FormVoucher} />
              </React.Suspense>
            </Main>
          </ProtectedRoute>
        </Switch>
      </Router>

    </div>
  );
}

export default App;
