<?php
  $opt1 = htmlspecialchars($_POST['PlayableAds']);
  $opt2 = htmlspecialchars($_POST['HTML5Games']);
  $opt3 = htmlspecialchars($_POST['wordpress']);
  $opt4 = htmlspecialchars($_POST['LandingPages']);
  $opt5 = htmlspecialchars($_POST['Others']);

  $name = htmlspecialchars($_POST['nameInfo']);
  $email  = htmlspecialchars($_POST['emailInfo']);
  $budget = htmlspecialchars($_POST['budgetInfo']);

  $message = htmlspecialchars($_POST['message']);

  $to      = 'contact@devlinkco.com';
  $subject = $name + ' ' + $email + ' ' + $budget + ' ' + $opt1 + $opt2 + $opt3 + $opt4 +$opt5;
  $headers = 'From: devlinkco@devlinkco.com';

  mail($to, $subject, $message, $headers);
?>