import logo from './logo.svg';
import ConversionForm from './ConversionForm';

function App() {
  return (
    <div>
      <header style={{display: 'flex', justifyContent: 'center'}}>
        <img src={logo} alt="logo" style={{width: '200px', height: '200px'}} />
      </header>
      <p>
        <ConversionForm />
      </p>
    </div>
  );
}

export default App;
