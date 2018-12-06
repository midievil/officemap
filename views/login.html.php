
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="icon" href="./favicon.ico">

    <title>MMTR office map</title>

    <!-- Bootstrap core CSS -->
    <link href="./dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="./css/main.css" rel="stylesheet">

    <!-- Custom styles for this template -->
    <link href="main.css" rel="stylesheet">
  </head>

  <body>

    

    <div class="fixed" style="width: 100%; padding-top: 200px;">
      <div id="divLogin" class="shadow p-3 bg-white rounded align-middle">
          <div class="">
              <form action="<?=BASE_URI?>login" method="POST">
                <div class="form-group">
                  <input type="text" name="login" class="form-control" id="tbEmail" aria-describedby="emailHelp" placeholder="Логин ММТР"
                    value="<?=isset($_POST['login']) ? $_POST['login'] : ''?>">
                </div>
                <div class="form-group">
                  <input type="password" name="password" class="form-control" id="tbPassword" placeholder="Пароль">
                </div>
                <div class="form-group form-check">
                  <input type="checkbox" class="form-check-input" id="cbRemember" name="remember" <?=(isset($_COOKIE['remember']) ? 'checked' : '' )?> >
                  <label class="form-check-label" for="cbRemember">Запомнить меня</label>
                </div>
                <button type="submit" class="btn btn-primary">Вход</button>
              </form>
          </div>
      </div>
    </div>

    

    <!-- Bootstrap core JavaScript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    
    <script src="./dist/js/jquery-3.3.1.min.js"></script>
    <script src="./dist/js/popper.min.js"></script>
    <script src="./dist/js/bootstrap.min.js"></script>    
    <script src="./js/main.js"></script>    
  </body>
</html>
