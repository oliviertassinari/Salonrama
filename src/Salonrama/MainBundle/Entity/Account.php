<?php

namespace Salonrama\MainBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Account
 *
 * @ORM\Table(name="account")
 * @ORM\Entity(repositoryClass="Salonrama\MainBundle\Entity\AccountRepository")
 */
class Account
{
    /**
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(name="email", type="string", length=320)
     */
    private $email;

    /**
     * @ORM\Column(name="password", type="string", length=40)
     */
    private $password;

    /**
     * @ORM\Column(name="is_active", type="boolean")
     */
    private $isActive;

    /**
     * @ORM\Column(name="last_login", type="datetime")
     */
    private $lastLogin;

    /**
     * @ORM\Column(name="signin", type="datetime")
     */
    private $signin;

    /**
     * @ORM\Column(name="confirmation_token", type="string", length=32)
     */
    private $confirmationToken;


    public function __construct()
    {
        $this->isActive = false;
        $this->confirmation_token = md5(uniqid(null, true));
    }
}
