<?php

namespace Salonrama\MainBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\AdvancedUserInterface;
use Salonrama\MainBundle\Encrypter;

/**
 * @ORM\Table(name="user")
 * @ORM\Entity(repositoryClass="Salonrama\MainBundle\Entity\UserRepository")
 */
class User implements AdvancedUserInterface
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
     * @ORM\Column(name="password", type="string", length=100)
     */
    private $password;

    /**
     * @ORM\Column(name="is_active", type="boolean")
     */
    private $isActive;

    /**
     * @ORM\Column(name="reset_password_token", type="string", length=32)
     */
    private $resetPasswordToken;

    /**
     * @ORM\Column(name="confirm_email", type="string", length=320)
     */
    private $confirmEmail;

    /**
     * @ORM\Column(name="confirm_email_token", type="string", length=32)
     */
    private $confirmEmailToken;

    /**
    * @ORM\ManyToOne(targetEntity="Salonrama\MainBundle\Entity\Account")
    * @ORM\JoinColumn(nullable=false)
    */
    private $account;

    public function __construct()
    {
        $this->resetPasswordToken = '';
        $this->confirmEmail = '';
        $this->confirmEmailToken = '';
        $this->isActive = false;
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
        $this->email = mb_strtolower($email, 'UTF-8');
    
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
     * Set resetPasswordToken
     *
     * @param string $resetPasswordToken
     * @return User
     */
    public function setResetPasswordToken($resetPasswordToken)
    {
        if($resetPasswordToken == 'regenerate')
        {
            $resetPasswordToken = md5(uniqid(null, true));
        }

        $this->resetPasswordToken = $resetPasswordToken;
    
        return $this;
    }

    /**
     * Get resetPasswordToken
     *
     * @return string 
     */
    public function getResetPasswordToken()
    {
        return $this->resetPasswordToken;
    }

    /**
     * Set confirmEmail
     *
     * @param string $confirmEmail
     * @return User
     */
    public function setConfirmEmail($confirmEmail)
    {
        $this->confirmEmail = mb_strtolower($confirmEmail, 'UTF-8');

        return $this;
    }

    /**
     * Get confirmEmail
     *
     * @return string 
     */
    public function getConfirmEmail()
    {
        return $this->confirmEmail;
    }

    /**
     * Set confirmEmailToken
     *
     * @param string $confirmEmailToken
     * @return User
     */
    public function setConfirmEmailToken($confirmEmailToken)
    {
        if($confirmEmailToken == 'regenerate')
        {
            $confirmEmailToken = md5(uniqid(null, true));
        }

        $this->confirmEmailToken = $confirmEmailToken;
    
        return $this;
    }

    /**
     * Get confirmEmailToken
     *
     * @return string 
     */
    public function getConfirmEmailToken()
    {
        return $this->confirmEmailToken;
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

    public function isAccountNonExpired()
    {
        return true;
    }

    public function isAccountNonLocked()
    {
        return true;
    }

    public function isCredentialsNonExpired()
    {
        return true;
    }

    public function isEnabled()
    {
        return $this->isActive;
    }
}