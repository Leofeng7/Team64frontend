import {Link} from 'react-router-dom'
export default function Navbar() {
  return (
    <div class="nav_container">
      <nav class="navbar navbar-light bg-light">
  <form class="container-fluid justify-content-start">
    <Link to='/man' class="btn btn-outline-success me-2" type="button">Inventory</Link>
    <Link to='/emp' class="btn btn-outline-success me-2" type="button">Employees</Link>
    <Link to='/srep' class="btn btn-outline-success me-2" type="button">Sales Report</Link>
    <Link to='/rrep' class="btn btn-outline-success me-2" type="button">Restock Report</Link>
    <Link to='/erep' class="btn btn-outline-success me-2" type="button">Excess Report</Link>
    <Link to='/xrep' class="btn btn-outline-success me-2" type="button">X Report</Link>
    <Link to='/zrep' class="btn btn-outline-success me-2" type="button">Z Report</Link>
    <Link to='/' class="btn btn-outline-success me-2" type="button">Log Out</Link>
  </form>
</nav>
    </div>
  )
}