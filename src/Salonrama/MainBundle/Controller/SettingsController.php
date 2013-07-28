<?php

namespace Salonrama\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class SettingsController extends Controller
{
    public function profileAction()
    {
        return $this->render('SalonramaMainBundle:Account:settings_profile.html.twig');
    }

    public function passwordAction()
    {
        return $this->render('SalonramaMainBundle:Account:settings_password.html.twig');
    }

    public function emailAction()
    {
        return $this->render('SalonramaMainBundle:Account:settings_email.html.twig');
    }

    public function deleteAction()
    {
        return $this->render('SalonramaMainBundle:Account:settings_delete.html.twig');
    }
}

?>