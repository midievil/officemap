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
    <link href="./css/main.css" rel="stylesheet">

    <!-- Custom styles for this template -->
    <link href="main.css?v=0.57" rel="stylesheet">
  </head>

  <body>

    <nav class="site-header sticky-top py-1">
      <div class="container d-flex flex-column flex-md-row justify-content-between">
          <a class="navbar-brand" href="#">#MMTRMap</a>
        <a class="py-2 d-none d-md-inline-block" href="#"></a>
        <a class="py-2 d-none d-md-inline-block" href="#"></a>
        <a class="py-2 d-none d-md-inline-block" href="#"></a>
        <a class="py-2 d-none d-md-inline-block" href="#"></a>
        <a class="py-2 d-none d-md-inline-block" href="#"></a>
        <a class="py-2 d-none d-md-inline-block" href="<?=BASE_URI?>logout">Выход</a>
      </div>
    </nav>

    <div class="position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center bg-light">
        <div id='divFilter' class="col-md-5 mx-auto">
            Этаж: <select id='ddlFloor' onchange="onFloorChanged()"></select>
        </div>
        <div class="row">
          <div id='divMainContainer' class="position-relative col-sm-10" ondrop="drop(event)" ondragover="allowDrop(event)" onclick='planClicked(event);'>
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
              <h4 id="hEmployee"></h4>
              <form>
                  <input type="hidden" id="hidX" />
                  <input type="hidden" id="hidY" />
        
                  <div class="form-group row" id="divSelectEmployee">
                    <label for="ddlEmployee" class="col-sm-3 col-form-label">Сотрудник</label>
                    <div class="col-sm-9">
                      <select class="form-control" id="ddlEmployee" onchange="ddlEmployeeChanged();"></select>
                    </div>
                  </div>

                  <div class="form-group row">
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
        
                  <button type="button" class="btn btn-primary editable" onclick="saveEmployee();">Сохранить</button>                  
                </form>
            </div>
            <div class="col-sm-4 avatar-container">
              <div class="avatar-frame">
                <img id="imgAvatar" width="100%">
              </div>
            </div>
        </div>
      </div>
    </div>

    
    <footer class="container py-5">
      <div class="row">
        <div class="col-12 col-md">
          <small class="d-block mb-4 text-muted">&copy; <a onclick="searchMap(14);" href="#">2018 Artem Sharypov</a></small>
        </div>
      </div>
    </footer>


    <!-- Bootstrap core JavaScript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    
    <script src="/dist/js/jquery-3.3.1.min.js"></script>
    <script src="/dist/js/popper.min.js"></script>
    <script src="/dist/js/bootstrap.min.js"></script>    
    <script src="/js/main.js?v=0.58"></script>
    <script src="/js/api.js?v=0.58"></script>
    <script src="/js/edit.js?v=0.58"></script>
    <script src="/js/filter.js?v=0.58"></script>
    <script src="/js/forms.js?v=0.58"></script>
    <script src="/js/screen.js?v=0.58"></script>
    <script>
      var avatarsUri = '<?=AVATARS_URI?>';
      var userId = '<?=Authorization::GetUserId()?>';
    </script>
  </body>
</html>
