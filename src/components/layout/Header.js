import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '../../assets/icon/logo.png'
import './Header.css'


function Header() {

  return (
    <Navbar className='header' expand="lg">
      <Container>

        {/* 로고 */}
        <Navbar.Brand as={Link} to="/">
          <img src={logo} alt="로고" height="40" />
        </Navbar.Brand>

        <Navbar.Toggle/>
        <Navbar.Collapse>

          {/* 왼쪽 메뉴 */}
          <Nav className="ml-auto">

            <NavDropdown title="About">
              <NavDropdown.Item as={Link} to="/about/brand">
                Brand
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/about/store">
                Store
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/about/archive">
                Archive
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Collection">
              <NavDropdown.Item as={Link} to="/collection/nature">
                자연
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/collection/love">
                사랑
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/collection/instinct">
                본능
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="PARFUM">
              <NavDropdown.Item as={Link} to="/parfum/Extrait">
                EXTRAIT DE PARFUM
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/parfum/Oil">
                OIL PERFUME
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/parfum/Bespoke">
                BESPOKE LAYERING
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="BODY">
              <NavDropdown.Item as={Link} to="/body/HandCream">
                HAND CREAM
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/body/BodyHairOil">
                BODY&HAIR OIL
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/body/HandBodyWash">
                HAND&BODY WASH
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link as={Link} to="/giftset">
              GIFT SET
            </Nav.Link>

            <Nav.Link as={Link} to="/acc">
              ACC
            </Nav.Link>



          </Nav>

          {/* 오른쪽 메뉴 */}
          <Nav className='ms-auto'>


              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>


            <Nav.Link as={Link} to="/cart">
              Cart
            </Nav.Link>

          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;