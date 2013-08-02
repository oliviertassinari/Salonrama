<?php

namespace Salonrama\MainBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;
use Salonrama\MainBundle\Encrypter;

/**
 * @ORM\Table(name="user")
 * @ORM\Entity(repositoryClass="Salonrama\MainBundle\Entity\UserRepository")
 */
class User implements UserInterface
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

    /**
    * @ORM\ManyToOne(targetEntity="Salonrama\MainBundle\Entity\Account")
    * @ORM\JoinColumn(nullable=false)
    */
    private $account;

    public function __construct()
    {
        $this->isActive = false;
        $this->confirmationToken = md5(uniqid(null, true));
    }

    public function getUsername()
    {
        return $this->email;
    }

    public function getSalt()
    {
        return '';
    }

    public function getRoles()
    {
        return array('ROLE_USER');
    }

    public function eraseCredentials()
    {
    }

    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set email
     *
     * @param string $email
     * @return User
     */
    public function setEmail($email)
    {
        $this->email = $email;
    
        return $this;
    }

    /**
     * Get email
     *
     * @return string 
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * Set password
     *
     * @param string $password
     * @return User
     */
    public function setPassword($password)
    {
        $this->password = Encrypter::encode($password);
    
        return $this;
    }

    /**
     * Get password
     *
     * @return string 
     */
    public function getPassword()
    {
        return Encrypter::decode($this->password);
    }

    /**
     * Set isActive
     *
     * @param boolean $isActive
     * @return User
     */
    public function setIsActive($isActive)
    {
        $this->isActive = $isActive;
    
        return $this;
    }

    /**
     * Get isActive
     *
     * @return boolean 
     */
    public function getIsActive()
    {
        return $this->isActive;
    }

    /**
     * Set lastLogin
     *
     * @param \DateTime $lastLogin
     * @return User
     */
    public function setLastLogin($lastLogin)
    {
        $this->lastLogin = $lastLogin;
    
        return $this;
    }

    /**
     * Get lastLogin
     *
     * @return \DateTime 
     */
    public function getLastLogin()
    {
        return $this->lastLogin;
    }

    /**
     * Set signin
     *
     * @param \DateTime $signin
     * @return User
     */
    public function setSignin($signin)
    {
        $this->signin = $signin;
    
        return $this;
    }

    /**
     * Get signin
     *
     * @return \DateTime 
     */
    public function getSignin()
    {
        return $this->signin;
    }

    /**
     * Set confirmationToken
     *
     * @param string $confirmationToken
     * @return User
     */
    public function setConfirmationToken($confirmationToken)
    {
        $this->confirmationToken = $confirmationToken;
    
        return $this;
    }

    /**
     * Get confirmationToken
     *
     * @return string 
     */
    public function getConfirmationToken()
    {
        return $this->confirmationToken;
    }

    /**
     * Set account
     *
     * @param \Salonrama\MainBundle\Entity\Account $account
     * @return User
     */
    public function setAccount(\Salonrama\MainBundle\Entity\Account $account)
    {
        $this->account = $account;
    
        return $this;
    }

    /**
     * Get account
     *
     * @return \Salonrama\MainBundle\Entity\Account 
     */
    public function getAccount()
    {
        return $this->account;
    }
}