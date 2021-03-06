<?php

namespace Salonrama\MainBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
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
    protected $id;

    /**
     * @ORM\Column(name="fist_name", type="string", length=40)
     */
    protected $firstName;

    /**
     * @ORM\Column(name="last_name", type="string", length=40)
     */
    protected $lastName;

    /**
     * @ORM\Column(name="newsletter_send", type="boolean")
     */
    protected $newsletterSend;

    /**
    * @ORM\OneToOne(targetEntity="Salonrama\MainBundle\Entity\Salon")
    * @ORM\JoinColumn(nullable=true)
    */
    protected $salon;

   /**
    * @ORM\OneToOne(targetEntity="Salonrama\MainBundle\Entity\Site")
    * @ORM\JoinColumn(nullable=true)
    */
    protected $site;

    /**
     * @ORM\Column(name="last_login", type="datetime", nullable=true)
     */
    protected $lastLogin;

    /**
     * @ORM\Column(name="signin", type="datetime")
     */
    protected $signin;

    public function __construct()
    {
        $this->signin = new \DateTime();
    }

    public function getName()
    {
        return $this->getFirstName().' '.$this->getLastName();
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
     * Set firstName
     *
     * @param string $firstName
     * @return Account
     */
    public function setFirstName($firstName)
    {
        $this->firstName = $firstName;
    
        return $this;
    }

    /**
     * Get firstName
     *
     * @return string 
     */
    public function getFirstName()
    {
        return $this->firstName;
    }

    /**
     * Set lastName
     *
     * @param string $lastName
     * @return Account
     */
    public function setLastName($lastName)
    {
        $this->lastName = $lastName;
    
        return $this;
    }

    /**
     * Get lastName
     *
     * @return string 
     */
    public function getLastName()
    {
        return $this->lastName;
    }

    /**
     * Set newsletterSend
     *
     * @param boolean $sendNewsletter
     * @return Account
     */
    public function setNewsletterSend($newsletterSend)
    {
        $this->newsletterSend = $newsletterSend;
    
        return $this;
    }

    /**
     * Get sendNewsletter
     *
     * @return boolean 
     */
    public function getNewsletterSend()
    {
        return $this->newsletterSend;
    }

    /**
     * Set salon
     *
     * @param \Salonrama\MainBundle\Entity\Salon $salon
     * @return Account
     */
    public function setSalon(\Salonrama\MainBundle\Entity\Salon $salon)
    {
        $this->salon = $salon;
    
        return $this;
    }

    /**
     * Get salon
     *
     * @return \Salonrama\MainBundle\Entity\Salon 
     */
    public function getSalon()
    {
        return $this->salon;
    }

    /**
     * Set site
     *
     * @param \Salonrama\MainBundle\Entity\Site $site
     * @return Account
     */
    public function setSite(\Salonrama\MainBundle\Entity\Site $site)
    {
        $this->site = $site;
    
        return $this;
    }

    /**
     * Get site
     *
     * @return \Salonrama\MainBundle\Entity\Site 
     */
    public function getSite()
    {
        return $this->site;
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
}