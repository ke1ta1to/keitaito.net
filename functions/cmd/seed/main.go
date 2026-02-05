package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/google/uuid"
	"github.com/ke1ta1to/keitaito.net/functions/internal/activities"
	"github.com/ke1ta1to/keitaito.net/functions/internal/contact"
	"github.com/ke1ta1to/keitaito.net/functions/internal/profile"
	"github.com/ke1ta1to/keitaito.net/functions/internal/skills"
	"github.com/ke1ta1to/keitaito.net/functions/internal/works"
)

func main() {
	activitiesTableName := os.Getenv("ACTIVITIES_TABLE_NAME")
	skillsTableName := os.Getenv("SKILLS_TABLE_NAME")
	worksTableName := os.Getenv("WORKS_TABLE_NAME")
	profileTableName := os.Getenv("PROFILE_TABLE_NAME")
	contactTableName := os.Getenv("CONTACT_TABLE_NAME")

	for _, env := range []struct{ name, value string }{
		{"ACTIVITIES_TABLE_NAME", activitiesTableName},
		{"SKILLS_TABLE_NAME", skillsTableName},
		{"WORKS_TABLE_NAME", worksTableName},
		{"PROFILE_TABLE_NAME", profileTableName},
		{"CONTACT_TABLE_NAME", contactTableName},
	} {
		if env.value == "" {
			log.Fatalf("%s environment variable is required", env.name)
		}
	}

	ctx := context.Background()

	cfg, err := config.LoadDefaultConfig(ctx)
	if err != nil {
		log.Fatalf("failed to load AWS config: %v", err)
	}
	ddb := dynamodb.NewFromConfig(cfg)

	activitiesRepo := activities.NewDynamoDBRepository(ddb, activitiesTableName)
	skillsRepo := skills.NewDynamoDBRepository(ddb, skillsTableName)
	profileRepo := profile.NewDynamoDBRepository(ddb, profileTableName)
	worksRepo := works.NewDynamoDBRepository(ddb, worksTableName)
	contactRepo := contact.NewDynamoDBRepository(ddb, contactTableName)

	// Seed Activities
	seedActivities := []*activities.Activity{
		{
			ID:          uuid.New().String(),
			Title:       "Started a new project",
			Date:        "2024-01",
			Description: "Kickoff for the new web application project focusing on e-commerce solutions.",
		},
		{
			ID:          uuid.New().String(),
			Title:       "Deployed version 1.0",
			Date:        "2024-02",
			Description: "Successfully launched the first version of the application with core features.",
		},
	}

	fmt.Println("Seeding activities...")
	for _, a := range seedActivities {
		if err := activitiesRepo.Create(ctx, a); err != nil {
			log.Fatalf("failed to create activity %q: %v", a.Title, err)
		}
		fmt.Printf("  Created activity: %s\n", a.Title)
	}

	// Seed Skills
	seedSkills := []*skills.Skill{
		{
			ID:      uuid.New().String(),
			Name:    "JavaScript",
			IconURL: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
		},
		{
			ID:      uuid.New().String(),
			Name:    "TypeScript",
			IconURL: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
		},
	}

	fmt.Println("Seeding skills...")
	for _, s := range seedSkills {
		if err := skillsRepo.Create(ctx, s); err != nil {
			log.Fatalf("failed to create skill %q: %v", s.Name, err)
		}
		fmt.Printf("  Created skill: %s\n", s.Name)
	}

	// Seed Profile
	seedProfile := &profile.Profile{
		Name:     "John Doe",
		Birthday: "1990-01-01",
		Location: "New York, USA",
		School:   "University of Example",
		ImageURL: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=1760&auto=format&fit=crop",
		X:        "https://x.com/johndoe",
		GitHub:   "https://github.com/johndoe",
		Zenn:     "https://zenn.dev/johndoe",
		Qiita:    "https://qiita.com/johndoe",
	}

	fmt.Println("Seeding profile...")
	if err := profileRepo.Update(ctx, seedProfile); err != nil {
		log.Fatalf("failed to update profile: %v", err)
	}
	fmt.Printf("  Created profile: %s\n", seedProfile.Name)

	// Seed Works
	seedWorks := []*works.Work{
		{
			ID:        uuid.New().String(),
			Title:     "Portfolio Website",
			Slug:      "portfolio-website",
			Content:   "A personal portfolio website showcasing my projects and skills.",
			Thumbnail: "https://images.unsplash.com/photo-1761839259494-71caddcdd6b3?q=80&w=2070&auto=format&fit=crop",
		},
		{
			ID:        uuid.New().String(),
			Title:     "E-commerce Platform",
			Slug:      "ecommerce-platform",
			Content:   "An online platform for buying and selling products with secure payment integration.",
			Thumbnail: "https://images.unsplash.com/photo-1761839258289-72f12b0de058?q=80&w=2070&auto=format&fit=crop",
		},
		{
			ID:        uuid.New().String(),
			Title:     "Blog Application",
			Slug:      "blog-application",
			Content:   "A full-featured blog application with user authentication and content management.",
			Thumbnail: "https://images.unsplash.com/photo-1761839257870-06874bda71b5?q=80&w=2069&auto=format&fit=crop",
		},
	}

	fmt.Println("Seeding works...")
	for _, w := range seedWorks {
		if err := worksRepo.Create(ctx, w); err != nil {
			log.Fatalf("failed to create work %q: %v", w.Title, err)
		}
		fmt.Printf("  Created work: %s\n", w.Title)
	}

	// Seed Contact
	seedContact := &contact.Contact{
		Email: "johndoe@example.com",
		X:     "https://x.com/johndoe",
	}

	fmt.Println("Seeding contact...")
	if err := contactRepo.Update(ctx, seedContact); err != nil {
		log.Fatalf("failed to update contact: %v", err)
	}
	fmt.Printf("  Created contact: %s\n", seedContact.Email)

	fmt.Println("Seed completed successfully!")
}
