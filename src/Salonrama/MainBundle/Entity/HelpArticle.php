<?php

namespace Salonrama\MainBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Table(name="help_article")
 * @ORM\Entity(repositoryClass="Salonrama\MainBundle\Entity\HelpArticleRepository")
 */
class HelpArticle
{
    /**
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(name="name", type="string", length=100)
     */
    private $name;

    /**
     * @ORM\Column(name="text", type="string", length=16777215)
     */
    private $text;

    /**
    * @ORM\ManyToOne(targetEntity="Salonrama\MainBundle\Entity\HelpNode", inversedBy="childrenArticle")
    * @ORM\JoinColumn(nullable=true)
    */
    private $parent;

    /**
     * @ORM\Column(name="feedback_yes", type="smallint", options={"unsigned"=true})
     */
    private $feedbackYes;

    /**
     * @ORM\Column(name="feedback_no", type="smallint", options={"unsigned"=true})
     */
    private $feedbackNo;

    /**
     * @ORM\Column(name="view", type="integer", options={"unsigned"=true})
     */
    private $view;

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
     * Set name
     *
     * @param string $name
     * @return Help
     */
    public function setName($name)
    {
        $this->name = $name;
    
        return $this;
    }

    /**
     * Get name
     *
     * @return string 
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set text
     *
     * @param string $text
     * @return Help
     */
    public function setText($text)
    {
        $this->text = $text;
    
        return $this;
    }

    /**
     * Get text
     *
     * @return string 
     */
    public function getText()
    {
        return $this->text;
    }

    /**
     * Set parent
     *
     * @param \Salonrama\MainBundle\Entity\HelpNode $parent
     * @return HelpArticle
     */
    public function setParent(\Salonrama\MainBundle\Entity\HelpNode $parent)
    {
        $this->parent = $parent;
    
        return $this;
    }

    /**
     * Get parent
     *
     * @return \Salonrama\MainBundle\Entity\HelpNode 
     */
    public function getParent()
    {
        return $this->parent;
    }

    /**
     * Set feedbackYes
     *
     * @param \SmallInt $feedbackYes
     * @return HelpArticle
     */
    public function setFeedbackYes($feedbackYes)
    {
        $this->feedbackYes = $feedbackYes;
    
        return $this;
    }

    /**
     * Get feedbackYes
     *
     * @return \SmallInt 
     */
    public function getFeedbackYes()
    {
        return $this->feedbackYes;
    }

    /**
     * Set feedbackNo
     *
     * @param \SmallInt $feedbackNo
     * @return HelpArticle
     */
    public function setFeedbackNo($feedbackNo)
    {
        $this->feedbackNo = $feedbackNo;
    
        return $this;
    }

    /**
     * Get feedbackNo
     *
     * @return \SmallInt 
     */
    public function getFeedbackNo()
    {
        return $this->feedbackNo;
    }

    /**
     * Set view
     *
     * @param integer $view
     * @return HelpArticle
     */
    public function setView($view)
    {
        $this->view = $view;
    
        return $this;
    }

    /**
     * Get view
     *
     * @return integer 
     */
    public function getView()
    {
        return $this->view;
    }
}