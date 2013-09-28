<?php

namespace Salonrama\MainBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Table(name="help_node")
 * @ORM\Entity(repositoryClass="Salonrama\MainBundle\Entity\HelpNodeRepository")
 */
class HelpNode
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
     * @ORM\ManyToOne(targetEntity="Salonrama\MainBundle\Entity\HelpNode", inversedBy="childrenNode")
     * @ORM\JoinColumn(nullable=true)
     */
    private $parent;

    /**
     * @ORM\OneToMany(targetEntity="Salonrama\MainBundle\Entity\HelpNode", mappedBy="parent")
     */
    private $childrenNode;

    /**
     * @ORM\OneToMany(targetEntity="Salonrama\MainBundle\Entity\HelpArticle", mappedBy="parent")
     */
    private $childrenArticle;

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
     * @return HelpCategorie
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
     * Set parent
     *
     * @param \Salonrama\MainBundle\Entity\HelpNode $parent
     * @return HelpNode
     */
    public function setParent(\Salonrama\MainBundle\Entity\HelpNode $parent = null)
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
     * Constructor
     */
    public function __construct()
    {
        $this->childrenNode = new \Doctrine\Common\Collections\ArrayCollection();
        $this->childrenArticle = new \Doctrine\Common\Collections\ArrayCollection();
    }
    
    /**
     * Add childrenNode
     *
     * @param \Salonrama\MainBundle\Entity\HelpNode $childrenNode
     * @return HelpNode
     */
    public function addChildrenNode(\Salonrama\MainBundle\Entity\HelpNode $childrenNode)
    {
        $this->childrenNode[] = $childrenNode;
    
        return $this;
    }

    /**
     * Remove childrenNode
     *
     * @param \Salonrama\MainBundle\Entity\HelpNode $childrenNode
     */
    public function removeChildrenNode(\Salonrama\MainBundle\Entity\HelpNode $childrenNode)
    {
        $this->childrenNode->removeElement($childrenNode);
    }

    /**
     * Get childrenNode
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getChildrenNode()
    {
        return $this->childrenNode;
    }

    /**
     * Add childrenArticle
     *
     * @param \Salonrama\MainBundle\Entity\HelpArticle $childrenArticle
     * @return HelpNode
     */
    public function addChildrenArticle(\Salonrama\MainBundle\Entity\HelpArticle $childrenArticle)
    {
        $this->childrenArticle[] = $childrenArticle;
    
        return $this;
    }

    /**
     * Remove childrenArticle
     *
     * @param \Salonrama\MainBundle\Entity\HelpArticle $childrenArticle
     */
    public function removeChildrenArticle(\Salonrama\MainBundle\Entity\HelpArticle $childrenArticle)
    {
        $this->childrenArticle->removeElement($childrenArticle);
    }

    /**
     * Get childrenArticle
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getChildrenArticle()
    {
        return $this->childrenArticle;
    }
}