import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles: {
    username: string;
  };
}

interface ReviewSectionProps {
  serverId: string;
}

export function ReviewSection({ serverId }: ReviewSectionProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [serverId]);

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, profiles(username)')
      .eq('server_id', serverId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setReviews(data as any);
      if (user) {
        const myReview = data.find((r: any) => r.user_id === user.id);
        if (myReview) {
          setUserReview(myReview as any);
          setRating(myReview.rating);
          setComment(myReview.comment || '');
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        variant: "destructive",
        title: "Sign in required",
        description: "Please sign in to leave a review"
      });
      return;
    }

    if (rating === 0) {
      toast({
        variant: "destructive",
        title: "Rating required",
        description: "Please select a star rating"
      });
      return;
    }

    setIsSubmitting(true);

    const reviewData = {
      server_id: serverId,
      user_id: user.id,
      rating,
      comment: comment.trim() || null
    };

    let error;
    if (userReview) {
      const result = await supabase
        .from('reviews')
        .update(reviewData)
        .eq('id', userReview.id);
      error = result.error;
    } else {
      const result = await supabase
        .from('reviews')
        .insert(reviewData);
      error = result.error;
    }

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    } else {
      toast({
        title: "Success",
        description: userReview ? "Review updated" : "Review submitted"
      });
      fetchReviews();
    }

    setIsSubmitting(false);
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.round(averageRating)
                      ? 'fill-primary text-primary'
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {averageRating.toFixed(1)} out of 5 ({reviews.length} reviews)
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {user ? (
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Your Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= rating
                            ? 'fill-primary text-primary'
                            : 'text-muted-foreground'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="comment" className="text-sm font-medium mb-2 block">
                  Your Review (optional)
                </label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this server..."
                  rows={4}
                />
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : userReview ? 'Update Review' : 'Submit Review'}
              </Button>
            </form>
          ) : (
            <div className="mb-6 p-4 bg-muted rounded-lg">
              <p className="text-sm">
                <Link to="/auth" className="text-primary hover:underline">
                  Sign in
                </Link>{' '}
                to leave a review
              </p>
            </div>
          )}

          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No reviews yet. Be the first to review!
              </p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="border-t pt-4">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {review.profiles?.username?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{review.profiles?.username || 'Unknown User'}</h4>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex mt-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? 'fill-primary text-primary'
                                : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                      </div>
                      {review.comment && (
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
