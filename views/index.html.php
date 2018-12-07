<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="icon" href="/favicon.ico">

    <title>MMTR office map</title>

    <!-- Bootstrap core CSS -->
    <link href="./dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Custom styles for this template -->
    <link href="/css/main.css?v=<?=$scriptVersion?>" rel="stylesheet">
  </head>

  <body>

    <nav class="site-header sticky-top py-1">
      <div class="container d-flex flex-column flex-md-row justify-content-between">
          <a class="navbar-brand" href="#">#MMTRMap</a>

          <div class="navbar-collapse" id="navbarNavDropdown">
            <ul class="navbar-nav">
              <? if(Authorization::CanEdit()) { ?>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Печать
                </a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                  <a class="dropdown-item" onclick='printEmployeesList()'>Список сотрудников</a>
                  <a class="dropdown-item" onclick='printMap()'>Карта</a>                  
                </div>
              </li>
              <? } ?>
            </ul>
          </div>

        
        <a class="py-2 d-none d-md-inline-block" href="<?=BASE_URI?>logout">Выход</a>
      </div>
    </nav>

    <div class="position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center bg-light">
        <div id='divFilter' class="col-md-5 mx-auto">
            Этаж: <select id='ddlFloor' onchange="onFloorChanged()"></select>
        </div>
        <div class="row">
          <div id='divMainContainer' class="position-relative col-sm-10" ondrop="drop(event)" ondragover="allowDrop(event)" onclick='planClicked(event);'>
              <div class="logo">
                <img src="/img/logo.png"><br>
                <h2 class="room-name"></h2>
              </div>
              <img id='imgPlan' />
          </div>

          <div id='divEmployeesList' class="col-sm-2">
              <input id='tbEmployeesFilter' class="form-control" type="text" placeholder="поиск" onkeyup="filterEmployees();" />

              <div class="form-group form-check editable" style="text-align: left;">
                <input type="checkbox" class="form-check-input" id="cbNotOnMap" onchange="filterNotOnMap();">
                <label class="form-check-label" for="cbNotOnMap">нет на карте</label>
              </div>
              
              <ul id='ulEmployees' class="list-group">
              </ul>
          </div>
        </div>
    </div>

    <div class="fixed-top">
      <div id="divEmployeeDetails" class="shadow p-3 bg-white rounded">
        <div style="height: 36px;">
          <button type="button" class="close" aria-label="Close" onclick="cancelEmployeeEdit();">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>        

        <div class="row">
            <div class="col-sm-8">
              <h4 id="hEmployee"></h4><span id="spanCoord"></span>
              <form>
                  <input type="hidden" id="hidX" />
                  <input type="hidden" id="hidY" />
        
                  <div class="form-group row" id="divSelectEmployee">
                    <label for="ddlEmployee" class="col-sm-3 col-form-label">Сотрудник</label>
                    <div class="col-sm-9">
                      <select class="form-control" id="ddlEmployee" onchange="ddlEmployeeChanged();"></select>
                    </div>
                  </div>

                  <div class="form-group row room">
                    <label for="ddlRoom" class="col-sm-3 col-form-label">Кабинет</label>
                    <div class="col-sm-9">
                      <select class="form-control editable" id="ddlRoom"></select>
                      <input type="text" class="form-control readonly" id="txtRoom" disabled />
                    </div>
                  </div>
                  
                  <div class="form-group row ip">
                    <label for="txtIP" class="col-sm-3 col-form-label">IP</label>
                    <div class="col-sm-9">
                      <input type="text" class="form-control" id="txtIP" placeholder="192.168.x.x">
                    </div>
                  </div>

                  <div class="form-group row skype">
                    <label for="txtIP" class="col-sm-3 col-form-label">Skype</label>
                    <div class="col-sm-9">
                      <a id="aSkype"></a>
                    </div>
                  </div>
        
                  <div class="buttons">
                    <button type="button" class="btn btn-primary editable" onclick="editEmployee();">Сохранить</button>
                    <button type="button" class="btn btn-danger editable" onclick="deleteEmployeeFromMap();">Убрать с карты</button>
                  </div>
                </form>
            </div>
            <div class="col-sm-4 avatar-container">
              <div class="avatar-frame">
                <img id="imgAvatar" width="100%" onclick="enlargePhoto();">
              </div>
            </div>
        </div>
      </div>
    </div>

    <div class="photo-preview-bg" onclick="closePhoto();">
      <div class="photo-preview">
        <img />
      </div>  
    </div>
    
    <footer class="container py-5">
      <div class="row">
        <div class="col-12 col-md">
          <small class="d-block mb-4 text-muted">&copy; 2018 <a onclick="searchMap(14);" href="#">Artem Sharypov</a></small>
        </div>
      </div>
    </footer>


    <!-- Bootstrap core JavaScript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    
    <script src="/dist/js/jquery-3.3.1.min.js"></script>
    <script src="/dist/js/popper.min.js"></script>
    <script src="/dist/js/bootstrap.min.js"></script>    
    <script src="/js/main.js?v=<?=$scriptVersion?>"></script>
    <script src="/js/api.js?v=<?=$scriptVersion?>"></script>
    <script src="/js/edit.js?v=<?=$scriptVersion?>"></script>
    <script src="/js/filter.js?v=<?=$scriptVersion?>"></script>
    <script src="/js/forms.js?v=<?=$scriptVersion?>"></script>
    <script src="/js/screen.js?v=<?=$scriptVersion?>"></script>
    <script src="/js/print.js?v=<?=$scriptVersion?>"></script>
    <script src="/js/pacman.js?v=<?=$scriptVersion?>"></script>
    <script>
      var scriptVersion = "<?=$scriptVersion?>";
      var avatarsUri = '<?=AVATARS_URI?>';
      var userId = '<?=Authorization::GetUserId()?>';
      var userCanEdit = <?=Authorization::CanEdit() ? "true" : "false" ?>;
    </script>
  </body>
</html>
