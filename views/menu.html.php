<nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
    <div class="container">
      <a class="navbar-brand pt-0 pb-0" href="">
        <img src="/img/logo.svg" width="130" alt="" class="mr-2">
        <img src="/img/logo_ellipse.svg" width="6" alt="">
        <span class="logo-style">Карта офиса</span>
      </a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
        
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="employeesMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Сотрудники
            </a>
            <div class="dropdown-menu" aria-labelledby="employeesMenuLink">
              <a class="dropdown-item" onclick="searchEmployee()">Поиск</a>
            </div>
          </li>

          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="devicesMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Принтеры
            </a>
            <div class="dropdown-menu" aria-labelledby="devicesMenuLink" id='divDevicesMenu'>
              
            </div>
          </li>

        <? if(Authorization::IsAdmin() || Authorization::IsMapAdmin()) { ?>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="devicesMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Отчеты
            </a>
            <div class="dropdown-menu" aria-labelledby="devicesMenuLink" id='divDevicesMenu'>
              <a class="dropdown-item" href="/report/employeesbyroom">Кол-во сотрудников по кабинетам</a>
            </div>
          </li>
        <? } ?>
        </ul>
      </div>
    </div>
</nav>