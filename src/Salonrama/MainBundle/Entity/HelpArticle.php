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
     * @ORM\Column(name="name", type="string", length=40)
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
}